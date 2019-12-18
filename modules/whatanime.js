import Axios from './axiosProxy';
import Request from 'request';
import Qs from 'querystring';
import CQ from './CQcode';
import config from './config';

const hosts = config.whatanimeHost;
let hostsI = 0;

const waURL = 'https://trace.moe';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36';

/**
 * whatanime搜索
 *
 * @param {string} imgURL
 * @param {boolean} [debug=false]
 * @returns
 */
async function doSearch(imgURL, debug = false) {
    let hostIndex = hostsI++ % hosts.length; //决定当前使用的host
    let msg = config.picfinder.replys.failed; //返回信息
    let success = false;

    function appendMsg(str, needEsc = true) {
        if (typeof str == 'string' && str.length > 0) msg += '\n' + (needEsc ? CQ.escape(str) : str);
    }

    await getSearchResult(imgURL, hosts[hostIndex])
        .then(async ret => {
            if (debug) {
                console.log(`\n[debug] whatanime[${hostIndex}]:`);
                console.log(JSON.stringify(ret.data));
            }

            let retcode = ret.code;
            if (retcode == 413) {
                msg = 'WhatAnime：图片体积太大啦，请尝试发送小一点的图片（或者也可能是您发送了GIF，是不支持的噢）';
                return;
            }

            ret = ret.data;

            let quota = ret.quota; //剩余搜索次数
            let expire = ret.expire; //次数重置时间
            if (ret.docs.length == 0) {
                console.log(`${new Date().toLocaleString()} [out] whatanime[${hostIndex}]:${retcode}\n${JSON.stringify(ret)}`);
                msg = `WhatAnime：当前剩余可搜索次数貌似用光啦！请等待${expire}秒后再试！`;
                return;
            }

            //提取信息
            let doc = ret.docs[0]; //相似度最高的结果
            let diff = 100.0 - doc.diff; //相似度
            diff = diff.toFixed(2);
            let jpName = doc.title_native || ''; //日文名
            let romaName = doc.title_romaji || ''; //罗马音
            let cnName = doc.title_chinese || ''; //中文名
            let posSec = Math.floor(doc.t); //位置：秒
            let posMin = Math.floor(posSec / 60); //位置：分
            posSec %= 60;
            let isR18 = doc.is_adult; //是否R18
            let anilistID = doc.anilist_id; //动漫ID
            let episode = doc.episode || '-'; //集数
            let type, start, end, img, synonyms;

            await getAnimeInfo(anilistID).then(info => {
                type = info.type + ' - ' + info.format; //类型
                let sd = info.startDate;
                start = sd.year + '-' + sd.month + '-' + sd.day; //开始日期
                let ed = info.endDate;
                end = ed.year > 0 ? ed.year + '-' + ed.month + '-' + ed.day : '';
                img = CQ.img(info.coverImage.large); //番剧封面图
                synonyms = info.synonyms_chinese || []; //别名

                //构造返回信息
                msg = CQ.escape(`[${diff}%] WhatAnime\n该截图出自第${episode}集的${posMin < 10 ? '0' : ''}${posMin}:${posSec < 10 ? '0' : ''}${posSec}`);
                if (quota <= 10) {
                    appendMsg(`WhatAnime[${hostIndex}]：注意，${expire}秒内搜索次数仅剩${quota}次`);
                }
                appendMsg(img, false);
                appendMsg(romaName);
                if (jpName != romaName) appendMsg(jpName);
                if (cnName != romaName && cnName != jpName) appendMsg(cnName);
                if (synonyms.length > 0 && !(synonyms.length >= 2 && synonyms[0] == '[' && synonyms[1] == ']')) {
                    let syn = `别名：“${synonyms[0]}”`;
                    for (let i = 1; i < synonyms.length; i++) syn += `、“${synonyms[i]}”`;
                    appendMsg(syn);
                }
                appendMsg(`类型：${type}`);
                appendMsg(`开播：${start}`);
                if (end.length > 0) appendMsg(`完结：${end}`);
                if (isR18) appendMsg('R18注意！');

                success = true;
            });

            if (config.picfinder.debug) console.log(`\n[whatanime][${hostIndex}]\n${msg}`);
        })
        .catch(e => {
            console.error(`${new Date().toLocaleString()} [error] whatanime[${hostIndex}] ${JSON.stringify(e)}`);
        });

    return {
        success,
        msg,
    };
}

/**
 * 取得搜番结果
 *
 * @param {string} imgURL 图片地址
 * @param {string} host 自定义whatanime的host
 * @returns Prased JSON
 */
async function getSearchResult(imgURL, host) {
    if (host === 'trace.moe') host = `https://${host}`;
    else if (!/^https?:\/\//.test(host)) host = `http://${host}`;
    let json = {
        code: 0,
        data: {},
    };
    //取得whatanime返回json
    await Axios.get(imgURL, {
        responseType: 'arraybuffer', //为了转成base64
    })
        .then(
            async ret =>
                new Promise((resolve, reject) => {
                    //由于axios无法自定义UA会被block，因此使用request
                    Request.post(
                        `${host}/search`,
                        {
                            headers: {
                                accept: 'application/json, text/javascript, */*; q=0.01',
                                'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                referer: waURL,
                                'user-agent': UA,
                                'x-requested-with': 'XMLHttpRequest',
                            },
                            body: Qs.stringify({
                                data: Buffer.from(ret.data, 'binary').toString('base64'),
                                filter: '',
                                trial: 2,
                            }),
                        },
                        (err, res, body) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            //json转换可能出错
                            try {
                                json.data = JSON.parse(body);
                            } catch (jsonErr) {
                                if (body.indexOf('413') !== -1) json.code = 413;
                                reject(413);
                                return;
                            }
                            resolve();
                        }
                    );
                })
        )
        .catch(e => {
            if (e != 413) console.error(`${new Date().toLocaleString()} [error] whatanime ${e}`);
        });

    return json;
}

/**
 * 取得番剧信息
 *
 * @param {number} anilistID
 * @returns Prased JSON
 */
function getAnimeInfo(anilistID) {
    return new Promise((resolve, reject) => {
        //由于axios无法自定义UA会被block，因此使用request
        Request.get(
            waURL + '/info?anilist_id=' + anilistID,
            {
                headers: {
                    'user-agent': UA,
                },
            },
            (err, res, body) => {
                if (err) reject();
                resolve(JSON.parse(body)[0]);
            }
        );
    });
}

export default doSearch;

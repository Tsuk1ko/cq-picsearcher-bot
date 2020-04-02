import Axios from './axiosProxy';
import CQ from './CQcode';
import config from './config';
import logError from './logError';

const hosts = config.whatanimeHost;
let hostsI = 0;

const token = config.whatanimeToken.trim();

const waURL = 'https://trace.moe';

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
            } else if (retcode != 200) {
                msg = ret.data;
                return;
            }

            ret = ret.data;

            let limit = ret.limit; //剩余搜索次数
            let limit_ttl = ret.limit_ttl; //次数重置时间
            if (ret.docs.length == 0) {
                console.log(`${new Date().toLocaleString()} [out] whatanime[${hostIndex}]:${retcode}\n${JSON.stringify(ret)}`);
                msg = `WhatAnime：当前剩余可搜索次数貌似用光啦！请等待${limit_ttl}秒后再试！`;
                return;
            }

            //提取信息
            let doc = ret.docs[0]; //相似度最高的结果
            let similarity = doc.similarity.toFixed(2); //相似度
            let jpName = doc.title_native || ''; //日文名
            let romaName = doc.title_romaji || ''; //罗马音
            let cnName = doc.title_chinese || ''; //中文名
            let posSec = Math.floor(doc.at); //位置：秒
            let posMin = Math.floor(posSec / 60); //位置：分
            posSec %= 60;
            let isR18 = doc.is_adult; //是否R18
            let anilistID = doc.anilist_id; //动漫ID
            let episode = doc.episode || '-'; //集数
            let type, start, end, img, synonyms;

            await getAnimeInfo(anilistID)
                .then(info => {
                    type = info.type + ' - ' + info.format; //类型
                    let sd = info.startDate;
                    start = sd.year + '-' + sd.month + '-' + sd.day; //开始日期
                    let ed = info.endDate;
                    end = ed.year > 0 ? ed.year + '-' + ed.month + '-' + ed.day : '';
                    img = CQ.img(info.coverImage.large); //番剧封面图
                    synonyms = info.synonyms_chinese || []; //别名

                    //构造返回信息
                    msg = CQ.escape(`WhatAnime [${similarity}%]\n该截图出自第${episode}集的${posMin < 10 ? '0' : ''}${posMin}:${posSec < 10 ? '0' : ''}${posSec}`);
                    if (limit <= 3) {
                        appendMsg(`WhatAnime[${hostIndex}]：注意，${limit_ttl}秒内搜索次数仅剩${limit}次`);
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
                })
                .catch(e => {
                    appendMsg('获取番剧信息失败');
                    logError(`${new Date().toLocaleString()} [error] whatanime getAnimeInfo`);
                    logError(e);
                });

            if (config.picfinder.debug) console.log(`\n[whatanime][${hostIndex}]\n${msg}`);
        })
        .catch(e => {
            logError(`${new Date().toLocaleString()} [error] whatanime[${hostIndex}]`);
            logError(e);
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
        code: 200,
        data: {},
    };
    //取得whatanime返回json
    await Axios.get(imgURL, {
        responseType: 'arraybuffer', //为了转成base64
    })
        .then(({ data: image }) => Axios.post(`${host}/api/search` + (token ? `?token=${token}` : ''), { image: Buffer.from(image, 'binary').toString('base64') }))
        .then(ret => {
            json.data = ret.data;
            json.code = ret.status;
        })
        .catch(e => {
            if (e.response) {
                json.code = e.response.status;
                json.data = e.response.data;
                logError(`${new Date().toLocaleString()} [error] whatanime`);
                logError(e);
            } else throw e;
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
    return Axios.get(`${waURL}/info?anilist_id=${anilistID}`).then(({ data }) => data[0]);
}

export default doSearch;

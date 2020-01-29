import { get } from './axiosProxy';
import nhentai from './nhentai';
import getSource from './getSource';
import CQ from './CQcode';
import config from './config';
import shorten from './urlShorten/is.gd';
import { parse } from 'url';
import pixivShorten from './urlShorten/pixiv';

const hosts = config.saucenaoHost;
let hostsI = 0;

const snDB = {
    all: 999,
    pixiv: 5,
    danbooru: 9,
    book: 18,
    anime: 21,
};

const exts = {
    j: 'jpg',
    p: 'png',
    g: 'gif',
};

/**
 * saucenao搜索
 *
 * @param {string} imgURL 图片地址
 * @param {string} db 搜索库
 * @param {boolean} [debug=false] 是否调试
 * @returns Promise 返回消息、返回提示
 */
async function doSearch(imgURL, db, debug = false) {
    const hostIndex = hostsI++ % hosts.length; //决定当前使用的host
    let warnMsg = ''; //返回提示
    let msg = config.picfinder.replys.failed; //返回消息
    let success = false;
    let lowAcc = false;
    let excess = false;

    await getSearchResult(hosts[hostIndex], imgURL, db)
        .then(async ret => {
            const data = ret.data;

            //如果是调试模式
            if (debug) {
                console.log(`\n[debug] saucenao[${hostIndex}]: ${hosts[hostIndex]}`);
                console.log(JSON.stringify(data));
            }

            //确保回应正确
            if (data.results && data.results.length > 0) {
                let {
                    header: {
                        short_remaining, //短时剩余
                        long_remaining, //长时剩余
                        similarity, //相似度
                        thumbnail, //缩略图
                    },
                    data: {
                        ext_urls,
                        title, //标题
                        member_name, //作者
                        member_id, //可能 pixiv uid
                        eng_name, //本子名
                        jp_name, //本子名
                    },
                } = data.results[0];

                let url = ''; //结果链接
                let source = null;
                if (ext_urls) {
                    url = ext_urls[0];
                    //如果结果有多个，优先取danbooru
                    for (let i = 1; i < ext_urls.length; i++) {
                        if (ext_urls[i].indexOf('danbooru') !== -1) url = ext_urls[i];
                    }
                    url = url.replace('http://', 'https://');
                    //若为danbooru则获取来源
                    source = await getSource(url).catch(() => null);
                }

                if (!title) title = url.indexOf('anidb.net') === -1 ? ' 搜索结果' : ' AniDB';

                let bookName = jp_name || eng_name; //本子名

                if (member_name && member_name.length > 0) title = `\n「${title}」/「${member_name}」`;

                //剩余搜图次数
                if (long_remaining < 20) warnMsg += CQ.escape(`saucenao[${hostIndex}]：注意，24h内搜图次数仅剩${long_remaining}次\n`);
                else if (short_remaining < 5) warnMsg += CQ.escape(`saucenao[${hostIndex}]：注意，30s内搜图次数仅剩${short_remaining}次\n`);
                //相似度
                if (similarity < 60) {
                    lowAcc = true;
                    warnMsg += CQ.escape(`相似度[${similarity}%]过低，如果这不是你要找的图，那么可能：确实找不到此图/图为原图的局部图/图清晰度太低/搜索引擎尚未同步新图\n`);
                    if (config.picfinder.useAscii2dWhenLowAcc && (db == snDB.all || db == snDB.pixiv)) warnMsg += '自动使用 ascii2d 进行搜索\n';
                }

                //回复的消息
                msg = await getShareText({
                    url,
                    title: `SauceNAO [${similarity}%]${title}`,
                    thumbnail,
                    author_url: member_id && url.indexOf('pixiv.net') >= 0 ? `https://pixiv.net/u/${member_id}` : null,
                    source,
                });

                success = true;

                //如果是本子
                if (bookName) {
                    bookName = bookName.replace('(English)', '');
                    const book = await nhentai(bookName).catch(e => {
                        console.error(`${new Date().toLocaleString()} [error] nhentai`);
                        console.error(e);
                        return false;
                    });
                    //有本子搜索结果的话
                    if (book) {
                        thumbnail = `https://t.nhentai.net/galleries/${book.media_id}/cover.${exts[book.images.thumbnail.t]}`;
                        url = `https://nhentai.net/g/${book.id}/`;
                    } else {
                        success = false;
                        warnMsg += CQ.escape('没有在nhentai找到对应的本子_(:3」∠)_\n或者可能是此query因bug而无法在nhentai中获得搜索结果\n');
                    }
                    msg = await getShareText({
                        url,
                        title: `[${similarity}%] ${bookName}`,
                        thumbnail,
                    });
                }

                //处理返回提示
                if (warnMsg.length > 0) warnMsg = warnMsg.substring(0, warnMsg.lastIndexOf('\n'));
            } else if (data.header.message) {
                switch (data.header.message) {
                    case 'Specified file no longer exists on the remote server!':
                        msg = '该图片已过期，请尝试二次截图后发送';
                        break;

                    case 'Problem with remote server...':
                        msg = `saucenao[${hostIndex}] 远程服务器出现问题，请稍后尝试重试`;
                        break;

                    default:
                        console.error(data);
                        msg = `saucenao[${hostIndex}] ${data.header.message}`;
                        break;
                }
            } else {
                console.error(`${new Date().toLocaleString()} [error] saucenao[${hostIndex}][data]`);
                console.error(data);
            }
        })
        .catch(e => {
            console.error(`${new Date().toLocaleString()} [error] saucenao[${hostIndex}][request]`);
            if (e.response) {
                if (e.response.status == 429) {
                    msg = `saucenao[${hostIndex}] 搜索次数已达单位时间上限，请稍候再试`;
                    excess = true;
                } else console.error(e.response.data);
            } else console.error(e);
        });

    if (config.picfinder.debug) console.log(`${new Date().toLocaleString()} [saucenao][${hostIndex}]\n${msg}`);

    return {
        success,
        msg,
        warnMsg,
        lowAcc,
        excess,
    };
}

/**
 * 链接混淆
 *
 * @param {string} url
 * @returns
 */
async function confuseURL(url) {
    const { hostname } = parse(url);
    if (['danbooru.donmai.us', 'konachan.com', 'yande.re'].includes(hostname)) {
        const { result, path, error } = await shorten(url);
        return error ? result : `https://j.loli.best/#${path}`;
    }
    return pixivShorten(url);
}

async function getShareText({ url, title, thumbnail, author_url, source }) {
    let text = `${title}
${CQ.img(thumbnail)}
${await confuseURL(url)}`;
    if (author_url) text += `\nAuthor: ${await confuseURL(author_url)}`;
    if (source) text += `\nSource: ${await confuseURL(source)}`;
    return text;
}

/**
 * 取得搜图结果
 *
 * @param {string} host 自定义saucenao的host
 * @param {string} imgURL 欲搜索的图片链接
 * @param {number} [db=999] 搜索库
 * @returns Axios对象
 */
function getSearchResult(host, imgURL, db = 999) {
    if (host === 'saucenao.com') host = `https://${host}`;
    else if (!/^https?:\/\//.test(host)) host = `http://${host}`;
    return get(`${host}/search.php`, {
        params: {
            db: db,
            output_type: 2,
            numres: 3,
            url: imgURL,
        },
    });
}

export default doSearch;

export { snDB };

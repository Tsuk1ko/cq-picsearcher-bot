/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-11 18:26:45 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-08-16 08:50:36
 */


/**
 * 转义
 *
 * @param {string} str 欲转义的字符串
 * @param {boolean} [insideCQ=false] 是否在CQ码内
 * @returns 转义后的字符串
 */
function escape(str, insideCQ = false) {
	let temp = str.replace(/&/g, '&amp;');
	temp = temp.replace(/\[/g, '&#91;');
	temp = temp.replace(/\]/g, '&#93;');
	if (insideCQ) {
		temp = temp.replace(/,/g, '&#44;');
		temp = temp.replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])/g, '&#91;emoji&#93;');
	}
	return temp;
}


/**
 * CQ码 图片
 *
 * @param {string} file 本地文件路径或URL
 * @returns CQ码 图片
 */
function img(file) {
	return "[CQ:image,file=" + escape(file, true) + "]";
}


/**
 * CQ码 分享链接
 *
 * @param {string} url 链接
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {string} image 图片URL
 * @returns CQ码 分享链接
 */
function share(url, title, content, image) {
	return "[CQ:share,url=" + escape(url, true) + ",title=" + escape(title, true) + ",content=" + escape(content, true) + ",image=" + escape(image, true) + "]";
}


/**
 * CQ码 @
 *
 * @param {number} qq
 * @returns CQ码 @
 */
function at(qq) {
	return "[CQ:at,qq=" + qq + "] ";
}


export default {
	escape,
	share,
	img,
	at
};

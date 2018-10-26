/*
 * @Author: Jindai Kirin 
 * @Date: 2018-10-26 14:44:55 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-10-26 14:59:24
 */
import Axios from 'axios';


function getSetu() {
	return Axios.get('https://api.lolicon.app/setu/').then(ret => {
		//检验返回状态
		if (ret.status == 200) {
			return ret.data;
		}
		return false;
	});
}


export default getSetu;

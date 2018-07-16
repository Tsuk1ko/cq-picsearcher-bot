# CQ-picfinder-robot
这是一个以 Nodejs 编写的酷Q机器人插件，用于通过 [Saucenao](https://saucenao.com/) 和 [WhatAnime](https://whatanime.ga) 对收到的图片进行以图搜图、以图搜番

## 部署
### 酷Q
本插件依赖 [酷Q机器人](https://cqp.cc) 以及相关插件和SDK运作

插件所使用的发送分享链接功能为酷Q Pro功能（Pro需要收费），如果你不想购买酷Q Pro，可以自行修改程序源码中的返回消息以使用非分享链接功能发送结果

### CoolQ HTTP API 插件
插件基于 [CoolQ HTTP API 插件](https://github.com/richardchien/coolq-http-api) 的 [node-cq-websocket](https://github.com/momocow/node-cq-websocket) SDK 进行开发，因此你需要在你的酷Q上启用并配置 CoolQ HTTP API 插件

配置过程按照其 [插件使用文档](https://cqhttp.cc/docs/4.2/#/Configuration) 即可，此处不赘述

### 开始搞事
- Node 版本需求 >= 8.11.0 （更低也行吧，总之开发环境是 8.11.x

```bash
git clone --recursive https://github.com/YKilin/CQ-picfinder-robot.git
cd CQ-picfinder-robot
cp config.json.default config.json
npm i
```

然后自行编辑`config.json`文件来配置该插件，配置项在下方有讲解

配置完成后先启用 CoolQ HTTP API 插件 再运行本程序，建议使用`pm2`守护运行
```bash
//没有pm2先安装
npm install pm2 -g

//首次运行
pm2 start main.mjs --node-args="--experimental-modules" --name="cqpf"

//运行
pm2 start cqpf

//停止
pm2 stop cqpf

//重启
pm2 restart cqpf

//查看日志
pm2 logs cqpf
```

## 配置 `config.json`
为了省事所以直接在这里写了注释，实际JSON是不允许注释的，请注意

```json
{
	//前面这几项配置请参考github.com/momocow/node-cq-websocket#new-cqwebsocketopt
	"host": "127.0.0.1",
	"port": 6700,
	"enableAPI": true,
	"enableEvent": true,
	"access_token": "",
	"qq": -1,				//此项请务必配置
	"reconnection": true,
	"reconnectionAttempts": 10,
	"reconnectionDelay": 1000,
	//搜图机器人配置
	"picfinder": {
		"debug": false,			//调试模式，启用后会在控制台输出每次查询的返回文本
		"admin": -1,			//指定管理者QQ
		"autoAddFriend": false,		//自动同意好友申请
		"autoAddGroup": false,		//自动同意入群申请（false时依然可以用命令手动允许，后续有说明）
		//复读机
		"repeat": {
			"enable": true,		//开关
			"times": 3,		//当检测到某个群有这么多次相同发言后会概率复读
			"probability": 40	//复读概率
		},
		//搜图模式
		"searchMode": {
			//进入搜图模式的命令匹配正则表达式
			"onReg": "竹竹搜[图圖]",
			//退出搜图模式的命令匹配正则表达式
			"offReg": "[谢謝]+竹竹",
			//开启时回复
			"on": "了解～请发送图片吧！支持批量噢！\n如想退出搜索模式请发送“谢谢竹竹”",
			//已经开启
			"alreadyOn": "您已经在搜图模式下啦！\n如想退出搜索模式请发送“谢谢竹竹”",
			//关闭
			"off": "不用谢～",
			//已经关闭
			"alreadyOff": "にゃ～"
		},
		//回复
		"replys": {
			//默认回复
			"default": "必须要发送图片我才能帮你找噢_(:3」」\n支持批量！",
			//调试模式时
			"debug": "维护升级中，暂时不能使用，抱歉啦~",
			//个人搜索次数到达上限时
			"personLimit": "您今天搜的图太多辣！休息一下明天再来搜吧~",
			//搜索失败时
			"failed": "搜索失败惹 QAQ\n有可能是服务器网络爆炸，请重试一次"
		}
	},
	//数据库配置（用于缓存搜图结果）
	"mysql": {
		"enable": false,		//是否开启缓存功能
		"expire": 172800,		//缓存时间（秒），默认为两天（172800秒）
		"host": "127.0.0.1",		//数据库地址
		"port": 3306,			//端口
		"db": "",			//数据库名
		"user": "",			//用户名
		"password": ""			//密码
	},
	//Saucenao地址，一般请不要动，除非你猜到了我提供此设置的意义（
	"saucenaoHost": [
		"saucenao.com"
	],
	//WhatAnime的Cookie，请访问WhatAnime后将Cookie填入此处，填入多个将会被轮次使用
	"whatanimeCookie": [
		"__cfduid=d25d7bd2b59809f974477d68548d4e3221531298009"
	]
}
```

## 使用
- 私聊
	- 直接发送图片即可
- 群组&讨论组
	- @机器人并发送图片
	- 特别地，**在群组中**可以发送**符合配置中正则表达式的发言**以进入搜图模式，在搜图模式中，发送的所有图片即使不@也会被搜图，此功能通常用于在手机上无法在转发图片时@的情况；另外，**进入搜图模式后也请务必记得退出搜图模式啊**！
- 可以在同一条消息中包含多张图片（针对电脑），会自动批量搜索
- 搜索图片时可以在消息内包含以下参数来指定搜索范围或者使用某项功能，参数之间互斥，优先级从上到下
	- `--get-url`获取图片的在线链接（不会搜图）
	- `--pixiv`只从P站中搜索
	- `--danbooru`只从Danbooru中搜索
	- `--book`搜索本子
	- `--anime`搜索番剧
- 如果搜索到本子，会自动在 nhentai 中搜索并返回链接（如果有汉化本会返回汉化本链接）
- 如果搜到番剧，会自动使用 WhatAnime 搜索番剧详细信息
	- AnimeDB 与 WhatAnime 的结果可能会不一致，是正常现象，毕竟这是两个不同的搜索引擎
	- 同时展示这两个搜索的目的是为了尽力得到你可能想要的识别结果

### 关于搜图模式
在搜图模式中可以通过发送特定字符串以指定后续所有图片的搜索范围，目前支持以下几种：
- `all`默认的全范围搜索模式
- 以下与上方“使用”中描述的搜索参数功能相同
	- `pixiv`
	- `danbooru`
	- `book`
	- `anime`

当成功识别字符串后机器人会有文字反馈，每当你重新进入搜图模式后，默认使用`all`模式

### 关于搜索缓存
在配置中打开缓存功能并正确配置数据库信息后则可以使用此功能，**数据库请自行建立**，但是表不用，程序会自动建立

在搜图时加入`--purge`参数可以无视缓存搜图并更新缓存

### 关于复读
这是一个附带的娱乐功能，你可以在配置里进行配置

1. 当某个群里出现复读现象时（复读不能被打断），如果复读次数大于设定的次数，则机器人会根据设定的复读概率进行概率复读
2. 如果成功复读，则不会再次参与本句的复读
3. 同一个人复读自己刷屏不算复读

### 关于手动同意进群申请
当你设定了`picfinder.admin`为你自己的QQ后，假如`123456789`是你需要让机器人加的群，向机器人私聊发送`--add-group=123456789`然后再邀请机器人即可

这个设定是一次性的


## 感谢以下(开源)项目（不分先后）
- Saucenao: https://saucenao.com
- WhatAnime: https://whatanime.ga ([GitHub](https://github.com/soruly/whatanime.ga))
- CoolQ HTTP API: https://cqhttp.cc ([GitHub](https://github.com/richardchien/coolq-http-api))
- node-cq-websocket: https://github.com/momocow/node-cq-websocket
- 酷Q: https://cqp.cc

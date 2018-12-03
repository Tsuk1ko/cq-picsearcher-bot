# CQ-picfinder-robot
这是一个以 Nodejs 编写的酷Q机器人插件，用于通过 [Saucenao](https://saucenao.com/) 和 [WhatAnime](https://whatanime.ga) 对收到的图片进行搜图、搜番、搜本子，并夹带了许多娱乐向功能（。）

## 部署流程
### 1. 酷Q
本插件依赖 [酷Q机器人](https://cqp.cc) 以及相关插件和SDK运作

Pro 不是必须的，Air 也可

### 2. CoolQ HTTP API 插件
插件基于 [CoolQ HTTP API 插件](https://github.com/richardchien/coolq-http-api) 的 [node-cq-websocket](https://github.com/momocow/node-cq-websocket) SDK 进行开发，因此你需要在你的酷Q上启用并配置 CoolQ HTTP API 插件

配置过程按照其 [插件使用文档](https://cqhttp.cc/docs/4.2/#/Configuration) 即可，此处不赘述

### 3. 开搞
Node 版本需求 >= `8.11.0` （反正，直接装最新版就行了

```bash
git clone https://github.com/Tsuk1ko/CQ-picfinder-robot.git
cd CQ-picfinder-robot
cp config.default.json config.json
npm i
```

然后自行编辑`config.json`文件来配置该插件，配置项在下方有讲解

配置完成后先启用 CoolQ HTTP API 插件 再运行本程序

可以直接使用`npm start`命令启动，但是建议使用`pm2`守护运行

```bash
#没有pm2先安装
npm install pm2 -g

#首次运行
pm2 start index.js --name="cqpf"

#运行
pm2 start cqpf

#停止
pm2 stop cqpf

#重启
pm2 restart cqpf

#查看日志
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
	"reconnection": true,
	"reconnectionAttempts": 10,
	"reconnectionDelay": 5000,
	//搜图机器人配置
	"picfinder": {
		"debug": false,			//调试模式，启用后会在控制台输出每次查询的返回文本
		"admin": -1,			//指定管理者QQ，请务必设置
		"autoAddFriend": false,		//自动同意好友申请
		"autoAddGroup": false,		//自动同意入群申请（false时依然可以用命令手动允许，后续有说明）
		"searchLimit": 30,		//每名用户每日搜索次数限制
		"textMode": true,		//文字模式发送搜图结果（酷QAir无法发送分享）
		//复读机
		"repeat": {
			"enable": true,		//开关
			"times": 3,		//当检测到某个群有这么多次相同发言后会概率参与复读
			"probability": 40,	//复读概率（百分比）
			"commonProb": 0.1	//日常复读概率（百分比）
		},
		//setu功能
		"setu": {
			"enable": false,	//是否启用
			"allowPM": true,	//是否允许私聊使用
			"deleteTime": 30,	//发送后这么多秒自动撤回（0则不撤回，下同）
			"cd": 600,		//使用冷却时间（秒），每名用户独立，0则无冷却
			"limit": 30,		//每名用户每日次数限制
			"whiteGroup": [],	//群组白名单（请按照json数组格式填写）
			"whiteOnly": false,	//仅允许白名单群使用（与上面的私聊使用是独立的）
			"whiteCd": 0,		//白名单群组的使用冷却时间
			"whiteDeleteTime": 0	//白名单群组的撤回时间
		},
		//指令正则表达式
		"regs": {
			//开启搜图模式
			"searchModeOn": "竹竹搜[图圖]",
			//关闭搜图模式
			"searchModeOff": "[谢謝]+竹竹",
			//签到
			"sign": "我(.*)签到",
			//色图
			"setu": "(竹竹.*[来來发發给給].*[色瑟][图圖])|(--setu)"
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
			"failed": "搜索失败惹 QAQ\n有可能是服务器网络爆炸，请重试一次",
			//签到相关
			"sign": "签到成功，送您10个赞！",
			"signed": "您今天已经签到过啦_(:3」∠)_",
			//开启搜图模式
			"searchModeOn": "了解～请发送图片吧！支持批量噢！\n如想退出搜索模式请发送“谢谢竹竹”",
			//已经开启搜图模式
			"searchModeAlreadyOn": "您已经在搜图模式下啦！\n如想退出搜索模式请发送“谢谢竹竹”",
			//关闭搜图模式
			"searchModeOff": "不用谢～",
			//已经关闭搜图模式
			"searchModeAlreadyOff": "にゃ～",
			//setu冷却中
			"setuLimit": "乖，要懂得节制噢 →_→",
			//setu请求错误
			"setuError": "瑟图服务器爆炸惹_(:3」∠)_",
			//其他不满足发送setu的条件
			"setuReject": "很抱歉，该功能暂不开放_(:3」」"
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
		"password": "",			//密码
		"expire": 172800		//缓存时间
	},
	//Saucenao地址，一般请不要动，除非你猜到了我提供此设置的意义（
	"saucenaoHost": [
		"saucenao.com"
	],
	//WhatAnime的域名
	"whatanimeHost": "trace.moe",
	//WhatAnime的Cookie，请访问WhatAnime后将Cookie填入此处，填入多个将会被轮次使用
	"whatanimeCookie": [
		"__cfduid=d25d7bd2b59809f974477d68548d4e3221531298009"
	]
}
```

## 更新
```bash
git pull
npm i
```

并检查默认配置文件`config.default.json`是否有新的配置内容，根据 README 的说明和自己的需要添加到配置文件`config.json`中

未配置的设置项将会取`config.default.json`中的配置值

## 日常使用
- 私聊
	- 直接发送图片即可
	- 详见“搜图模式”
- 群组&讨论组
	- @机器人并发送图片
	- 详见“搜图模式”（群限定）
	- 特别地，**在群组中**可以发送**符合配置中正则表达式的发言**以进入搜图模式，在搜图模式中，发送的所有图片即使不@也会被搜图，此功能通常用于在手机上无法在转发图片时@的情况；另外，**进入搜图模式后也请务必记得退出搜图模式啊**！
- 可以在同一条消息中包含多张图片（针对电脑），会自动批量搜索
- 搜索图片时可以在消息内包含以下参数来指定搜索范围或者使用某项功能，参数之间互斥，优先级从上到下
	- `--get-url`：获取图片的在线链接（不会搜图）
	- `--pixiv`：从P站中搜索
	- `--danbooru`：从Danbooru中搜索
	- `--book`：搜索本子
	- `--anime`：搜索番剧
- 如果搜索到本子，会自动在 nhentai 中搜索并返回链接（如果有汉化本会优先返回汉化本链接）
- 如果搜到番剧，会自动使用 WhatAnime 搜索番剧详细信息
	- AnimeDB 与 WhatAnime 的结果可能会不一致，是正常现象，毕竟这是两个不同的搜索引擎
	- 同时展示这两个搜索的目的是为了尽力得到你可能想要的识别结果

### 搜图模式
搜图模式存在的意义是方便手机用户在转发图片等不方便在消息中夹带@或搜图参数的情况下指定搜索库

- 在私聊时直接发送**图库关键字**
	- 此时你发出来的下一张图（只有下一张，也就是**一次性**的）会使用指定搜索库
- 在群组中发送**符合配置中正则表达式的发言**进入搜图模式
	- 此时你发出的所有图片都会被搜图（默认使用全范围搜索）
	- 发送**图库关键字**后，你后续发出的**所有**图片都会使用你指定的搜索库
	- 每次使用完后**请务必记得退出搜图模式**啊，同理，也是发送**符合配置中正则表达式的发言**

图库关键字：
- `all`：默认的全范围搜索模式
- 以下与上方“使用”中描述的搜索参数功能相同
	- `pixiv`
	- `danbooru`
	- `book`
	- `anime`


### 搜索缓存
在配置中打开缓存功能并正确配置数据库信息后则可以使用此功能，**数据库请自行建立**，但是表不用，程序会自动建立

在搜图时加入`--purge`参数可以无视缓存搜图并更新缓存

### 娱乐功能
#### 复读
1. 当某个群里出现复读现象时（复读不能被打断），如果复读次数大于设定的次数，则机器人会根据设定的复读概率进行概率复读
2. 如果成功复读，则不会再次参与本句的复读
3. 同一个人复读自己刷屏不算复读
4. 日常复读即为平时群员说话时有概率直接进行复读

#### setu
自行看`config.json`意会

### 手动同意进群申请
当你设定了`picfinder.admin`为你自己的QQ后，假如`123456789`是你需要让机器人加的群，向机器人私聊发送`--add-group=123456789`然后再邀请机器人即可

允许入群是**一次性**的

### 封禁用户/群组
发送`--ban-u=Q号`或`--ban-g=群号`

该封禁功能并不是真的拉入黑名单，仅仅是忽略用户/群的发言

如果想解封请自行编辑`data/ban.json`删除对应Q号/群号


## 感谢以下项目（不分先后）
- Saucenao  
  https://saucenao.com
- WhatAnime  
  https://trace.moe/ ([GitHub](https://github.com/soruly/trace.moe))
- CoolQ HTTP API  
  https://cqhttp.cc ([GitHub](https://github.com/richardchien/coolq-http-api))
- node-cq-websocket  
  https://github.com/momocow/node-cq-websocket
- 酷Q  
  https://cqp.cc

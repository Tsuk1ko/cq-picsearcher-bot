# CQ-picfinder-robot

这是一个以 Nodejs 编写的酷Q机器人插件，用于搜图、搜番、搜本子，并夹带了许多娱乐向功能（。）

目前支持：

- [saucenao](https://saucenao.com)
- [WhatAnime](https://trace.moe)
- [ascii2d](https://ascii2d.net)

[更新日志](CHANGELOG.md)

## 部署流程

### 1. 酷Q

本插件依赖 [酷Q机器人](https://cqp.cc) 以及相关插件和SDK运作

Pro 不是必须的，Air 也可，**但 Air 无法发送图片，某些功能会受限**

### 2. CoolQ HTTP API 插件

插件基于 [CoolQ HTTP API 插件](https://github.com/richardchien/coolq-http-api) 的 [node-cq-websocket](https://github.com/momocow/node-cq-websocket) SDK 进行开发，因此你需要在你的酷Q上启用并配置 CoolQ HTTP API 插件

如何找到配置文件请参考 [插件使用文档](https://cqhttp.cc/docs/4.10/#/Configuration)，**对于本项目，必须将`use_ws`设置为`true`**，其他配置项自由发挥

注：插件更新换代较快，部署时请以最新版本的插件使用文档为准

### 3. 开搞

Node 版本需求 >= `8.11.0` （反正，直接装最新版就行了

示例：

```bash
git clone https://github.com/Tsuk1ko/CQ-picfinder-robot.git
cd CQ-picfinder-robot
cp config.default.json config.json
npm i
```

**注意此处需要将`config.default.json`复制一份，重命名为`config.json`**，然后编辑`config.json`文件来配置本程序，配置项在下方有讲解

配置完成后先启用 CoolQ HTTP API 插件 再运行本程序

初次尝试建议直接使用`npm start`命令启动，可以直接看到运行日志，方便查看报错原因

实际正式使用建议用`pm2`守护运行

```bash
# 没有pm2必须先安装
npm install pm2 -g

# 首次运行（只要重启机器后的第一次就算首次）
npm run pm2first

# 运行
npm run pm2start

# 停止
npm run pm2stop

# 重启
npm run pm2restart

# 查看日志
npm run pm2log
```

## 配置 `config.json`

为了省事所以直接在这里写了注释，实际JSON是不允许注释的，请注意

```javascript
{
    // 前面这几项配置请参考 https://github.com/momocow/node-cq-websocket/blob/master/docs/api/CQWebSocket.md#cqwebsocketoption
    "host": "127.0.0.1",
    "port": 6700,
    "enableAPI": true,
    "enableEvent": true,
    "access_token": "",
    "reconnection": true,
    "reconnectionAttempts": 10,
    "reconnectionDelay": 5000,
    // 以下开始都是搜图机器人配置
    "picfinder": {
        "debug": false,            // 调试模式，启用后会在控制台输出每次查询的返回文本
        "admin": -1,               // 指定管理者QQ，请务必设置
        "autoAddFriend": false,    // 自动同意好友申请（false则忽略，但不会拒绝）
        "addFriendAnswers": [],    // 根据问题回答同意好友申请（后续详解
        "autoAddGroup": false,     // 自动同意入群申请（false同上，但可以用命令手动允许，后续有说明）
        "searchLimit": 30,         // 每名用户每日搜索次数限制
        "searchModeTimeout": 60,   // 搜图模式超时时间（秒）
        // 复读机
        "repeat": {
            "enable": true,        // 开关
            "times": 3,            // 当检测到某个群有这么多次相同发言后会概率参与复读
            "probability": 40,     // 复读概率（百分比）
            "commonProb": 0.1      // 日常复读概率（百分比）
        },
        // setu 功能
        "setu": {
            "enable": false,       // 是否启用
            "allowPM": true,       // 是否允许私聊使用
            "pximgServerPort": "60233", // P站图本地反代端口，若端口冲突请修改此项
            "usePximgAddr": "",    // 设置使用的P站本地反代地址，后面详解
            "pximgProxy": "",      // 设置发送setu时使用的反向代理，后面详解
            "deleteTime": 60,      // 发送后这么多秒自动撤回（0则不撤回，下同）
            "cd": 600,             // 使用冷却时间（秒），每名用户独立，0则无冷却
            "limit": 30,           // 每名用户每日次数限制
            "whiteGroup": [],      // 群组白名单（请按照json数组格式填写）
            "whiteOnly": false,    // 仅允许白名单群使用（与上面的私聊使用是独立的）
            "whiteCd": 0,          // 白名单群组的使用冷却时间
            "whiteDeleteTime": 0   // 白名单群组的撤回时间
        },
        // 指令正则表达式
        "regs": {
            // 开启搜图模式
            "searchModeOn": "竹竹搜[图圖]",
            // 关闭搜图模式
            "searchModeOff": "[谢謝]+竹竹",
            // 签到
            "sign": "我(.*)签到",
            // setu
            "setu": "(竹竹.*[来來发發给給].*[色瑟][图圖])|(--setu)"
        },
        // 回复
        "replys": {
            // 默认回复
            "default": "必须要发送图片我才能帮你找噢_(:3」」\n支持批量！",
            // 调试模式时
            "debug": "维护升级中，暂时不能使用，抱歉啦~",
            // 个人搜索次数到达上限时
            "personLimit": "您今天搜的图太多辣！休息一下明天再来搜吧~",
            // 搜索失败时
            "failed": "搜索失败惹 QAQ\n有可能是服务器网络爆炸，请重试一次",
            // 签到相关
            "sign": "签到成功，送您10个赞！",
            "signed": "您今天已经签到过啦_(:3」∠)_",
            // 开启搜图模式
            "searchModeOn": "了解～请发送图片吧！支持批量噢！\n如想退出搜索模式请发送“谢谢竹竹”",
            // 已经开启搜图模式
            "searchModeAlreadyOn": "您已经在搜图模式下啦！\n如想退出搜索模式请发送“谢谢竹竹”",
            // 关闭搜图模式
            "searchModeOff": "不用谢～",
            // 已经关闭搜图模式
            "searchModeAlreadyOff": "にゃ～",
            // setu冷却中
            "setuLimit": "乖，要懂得节制噢 →_→",
            // setu请求错误
            "setuError": "瑟图服务器爆炸惹_(:3」∠)_",
            // 其他不满足发送setu的条件
            "setuReject": "很抱歉，该功能暂不开放_(:3」」"
        },
        // OCR（详细见“附加功能”）
        "ocr": {
            "use": "ocr.space", // 选择使用的OCR服务
            "ocr.space": {
                "defaultLANG": "eng",
                "apikey": ""
            },
            "baidubce": {
                "useApi": "accurate_basic",
                "apiKey": "",
                "secretKey": ""
            },
            "tencent": {
                "SecretId": "",
                "SecretKey": "",
                "Region": "ap-hongkong"
            }
        },
        // 明日方舟公开招募计算器（详细见“附加功能”）
        "akhr": {
            "enable": false,    // true 则启用
            "ocr": "ocr.space"  // 选择使用的OCR服务
        }
    },
    // 数据库配置（用于缓存搜图结果）
    "mysql": {
        "enable": false,       // 是否开启缓存功能
        "expire": 172800,      // 缓存时间（秒），默认为两天（172800秒）
        "host": "127.0.0.1",   // 数据库地址
        "port": 3306,          // 端口
        "db": "",              // 数据库名
        "user": "",            // 用户名
        "password": "",        // 密码
        "expire": 172800       // 缓存时间
    },
    // Saucenao 地址，一般请不要动，除非你猜到了我提供此设置的意义（
    "saucenaoHost": [
        "saucenao.com"
    ],
    // WhatAnime的域名，同上
    "whatanimeHost": [
        "trace.moe"
    ]
}
```

## 更新

```bash
git pull
npm i
```

然后阅读[更新日志](CHANGELOG.md)，如果有新添加的配置内容，根据 README 的说明和自己的需要添加到配置文件`config.json`中

未配置的设置项将会取`config.default.json`中的配置值

## 日常使用

- 私聊
  - 直接发送图片即可
  - 详见“搜图模式”
- 群组&讨论组
  - @机器人并发送图片
  - 详见“搜图模式”（群限定）
  - 特别地，**在群组中**可以发送**符合配置中正则表达式的发言**以进入搜图模式，在搜图模式中，发送的所有图片即使不@也会被搜图，此功能通常用于在手机上无法在转发图片时@的情况；另外，**进入搜图模式后也请务必记得退出搜图模式啊**！
- 可以在同一条消息中包含多张图片（针对PC），会自动批量搜索
- 搜索图片时可以在消息内包含以下参数来指定搜索范围或者使用某项功能，参数之间互斥，优先级从上到下
  - `--get-url`：获取图片的在线链接（不会搜图）
  - `--a2d`：使用 ascii2d 进行搜索（优势在于可搜索局部图）
  - `--pixiv`：从P站中搜索
  - `--danbooru`：从 Danbooru 中搜索
  - `--book`：搜索本子
  - `--anime`：搜索番剧
- 如果 saucenao 得到的结果相似度低于60%，会自动使用 ascii2d 进行搜索
- 如果搜索到本子，会自动在 nhentai 中搜索并返回链接（如果有汉化本会优先返回汉化本链接）
- 如果搜到番剧，会自动使用 WhatAnime 搜索番剧详细信息
  - AnimeDB 与 WhatAnime 的结果可能会不一致，是正常现象，毕竟这是两个不同的搜索引擎
  - 同时展示这两个搜索的目的是为了尽力得到你可能想要的识别结果

## 搜图模式

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

该功能的目的是为了节省使用 saucenao 的 API

在配置中打开缓存功能并正确配置数据库信息后则可以使用此功能，**数据库请自行建立**，但是表不用，程序会自动建立

在搜图时加入`--purge`参数可以无视缓存搜图并更新缓存

## 处理好友申请

- 如果在QQ中设置选择“允许任何人”，则直接通过，酷Q无法干预
- 如果选择“需要验证信息”，则是否通过由`autoAddFriend`设置项决定
- 如果选择“需要正确回答问题”，则是否通过由对方的回答决定，酷Q无法干预
- 如果选择“需要回答问题并由我确认”，则在`autoAddFriend`为`true`，且`addFriendAnswers`数组不为空的情况下会进行判断，只有对方的回答与`addFriendAnswers`的设置完全一致才会同意

\* `autoAddFriend`为`false`时不会主动拒绝申请，只是忽略申请而已，`autoAddGroup`同理

### `addFriendAnswers`配置规则

请将问题的答案**顺次**作为`addFriendAnswers`数组的元素写入，例：

```json
"addFriendAnswers": [
    "问题一的答案",
    "问题二的答案"
]
```

目前貌似最多只可以设置两个问题，请一定要写入与问题个数相等数量的元素，多写会爆炸的

\* 如果你设置了两个问题但是只在`addFriendAnswers`数组中写了一个元素，那么只会验证第一个问题

## 手动同意进群申请

当你设定了`picfinder.admin`为你自己的QQ后，假如`123456789`是你需要让机器人加的群，向机器人私聊发送`--add-group=123456789`，此时

- 如果该群之前已经在机器人处于运行状态的时候邀请过机器人，那么该邀请会被直接同意
- 如果之前没有邀请过，那么下一次邀请将会被同意
- 以上两种操作都是**一次性**的

## 封禁用户/群组

发送`--ban-u=Q号`或`--ban-g=群号`

该封禁功能并不是真的拉入黑名单，仅仅是忽略用户/群的发言

如果想解封请自行编辑`data/ban.json`删除对应Q号/群号

## 娱乐功能

### 复读

1. 当某个群里出现复读现象时（复读不能被打断），如果复读次数大于设定的次数，则机器人会根据设定的复读概率进行概率复读
2. 如果成功复读，则不会再次参与本句的复读
3. 同一个人复读自己刷屏不算复读
4. 日常复读即为平时群员说话时有概率直接进行复读

### setu

自行看`config.json`意会

#### usePximgAddr 设置项说明

若你使用的是酷Q Docker 版，你可能需要此设置

假如你将本程序部署在宿主机上，然后使用酷Q Docker 版，那么你需要将该项设置为宿主机的IP，或是在 Docker 容器内可以访问到宿主机的 IP，否则无法使用本地反代发送 setu

当然，你也可以通过配置`pximgProxy`来简单地解决这个问题

注：除了上面所说的格式`<IP>`，该设置项也支持`<IP>:<Port>`或`:<Port>`的格式，在需要的情况下可结合`pximgServerPort`设置项自由发挥

#### pximgProxy 设置项说明

该设置项旨在可以自定义 i.pximg.net 的反代，以起到在国内可以加速下载 pixiv 图片并解决防盗链问题的作用

该设置项为空字符串时不会启用该功能，而是直接使用本程序自建的本地反代下载图片以解决防盗链问题，本质上是直连下载

如需开启，则填写反代网址开头部分，程序会将其与 pximg 图片链接后半部分拼接组成图片地址

例如原图地址`https://i.pximg.net/img-original/img/2019/01/16/01/49/12/72685648_p0.jpg`的后半部分`img-original/img/2019/01/16/01/49/12/72685648_p0.jpg`

以下是使用配置示例：

- https://pixiv.cat  
  则配置为`"pximgProxy": "https://i.pixiv.cat/",`  
  最终得到图片地址`https://i.pixiv.cat/img-original/img/2019/01/16/01/49/12/72685648_p0.jpg`

## 附加功能

这部分功能只是开发者一拍大腿加上去的 \_(:3」∠)\_

### OCR 文字识别

修改`use`配置项以选择一个 OCR 服务来使用，目前支持`ocr.space`、`baidubce`、`tencent`

#### ocr.space

由于是免费的 OCR 服务，效果远不如手机QQ客户端上的“提取图中文字”功能，只用在在电脑前懒得掏手机的场合

配置项说明：

- `defaultLANG`是不指定语言时的默认识别语言（[支持的语言](https://ocr.space/ocrapi#PostParameters)）
- `apikey`可以到[这里](https://ocr.space/ocrapi#free)申请免费的（每日可用 500 次），但你也可以留空不填，此时会使用官方默认的`helloworld`（限制次数不明）

使用方法：

与搜图类似，发送图片时附加`--ocr`参数即可，同时需要用`--lang=语言`来指定需要识别的语言，不指定时使用配置中的`defaultLANG`

语言在上面“支持的语言”中都有列出，格式均为3字母，但本程序也支持使用以下缩写形式

- ch / cn / zh / zhs -> chs （简体中文）
- zht -> cht （繁体中文）
- en -> eng
- jp -> jpn
- ko -> kor
- fr -> fre
- ge -> ger
- ru -> rus

#### baidubce

百度 OCR 每日送免费使用额度，**不手动开通付费的情况下不会额外计费**，请放心使用

请先到[百度 AI 开放平台](https://ai.baidu.com/tech/ocr)登录并新建一个应用

配置项说明：

- `useApi`指定 OCR 的 API，默认为`accurate_basic`，有以下可选项
  - `general_basic`通用文字识别：每日免费 50000 次
  - `accurate_basic`通用文字识别（高精度版）：每日免费 500 次
  - 其他支持的 API 请查阅[文档](https://ai.baidu.com/docs#/OCR-API/top)
- `apiKey`为应用的 API Key
- `secretKey`为应用的 Secret Key

使用方法：

与搜图类似，发送图片时附加`--ocr`参数即可，可用`--lang=语言`来指定需要识别的语言，不指定时默认为中英混合（[支持的语言](https://ai.baidu.com/docs#/OCR-API/e1bd77f3)）

通用文字识别（高精度版）**只支持识别中英混合内容**，自定义语言无效

语言在上面“支持的语言”中都有列出，格式均为3字母，大小写无所谓，但本程序也支持使用以下缩写形式的语言表示

- ch / cn / zh -> CHN_ENG （中英混合）
- en -> ENG
- jp -> JAP
- ko -> KOR
- fr -> FRE
- ge -> GER
- ru -> RUS

#### tencent

腾讯 OCR 每个 API 每**月**会赠送 1000 次免费使用额度（某些特殊的 API 除外），如果你超出额度，**将自动转变为后付费模式进行计费**，若欠费会造成账号冻结，具体请看[计费概述](https://cloud.tencent.com/document/product/866/17619)

注：程序会统计每月使用次数（仅为通过该程序调用的次数），当某个 API 使用次数达到`950`次后会阻止继续请求该 API 来防止产生费用，**但这也不是绝对安全的保护措施；使用腾讯 OCR 请自行注意额度，我不对任何超额使用导致的扣费负责**

请先到腾讯云控制台登录并开通[通用印刷体识别](https://console.cloud.tencent.com/ai/ocr/general)、通用印刷体识别（高速版）、通用印刷体识别（高精度版），然后在[这里](https://console.cloud.tencent.com/cam/capi)查看 SecretId 和 SecretKey，填入到设置项中

开通三个 API 的作用是，程序可以轮流调用这三个 API，相当于每个月可以有 3000 次的免费额度

如果你只想使用某些 API，可以修改配置文件中的`useApi`数组

- `GeneralBasicOCRRequest`通用印刷体识别
- `GeneralFastOCRRequest`通用印刷体识别（高速版）
- `GeneralAccurateOCRRequest`通用印刷体识别（高精度版）

`Region`设置项可以下取值，是必要参数，腾讯 API 文档的解释是“地域参数，用来标识希望操作哪个地域的数据”，但该值与请求的 API 服务器无关，具体用途不明；当刚开通某个 API 时，某些地域可能无法使用，仍提示“服务未开通”

- ap-beijing
- ap-guangzhou
- ap-hongkong
- ap-shanghai
- na-toronto

你可以在[此处](https://console.cloud.tencent.com/ai/source/ocr)查看 API 免费额度使用情况

### 明日方舟公开招募计算器

该功能默认关闭，需要配置`config.json`启用（请看很前面的配置说明）

修改`ocr`配置项以选择一个 OCR 服务来使用，目前支持`ocr.space`、`baidubce`、`tencent`

发送公开招募含有词条的界面截图并附加`--akhr`参数，会生成词条组合结果图片并发送，效果类似于下面这样

![akhr](https://i.loli.net/2019/05/22/5ce4e076474cd34775.jpg)

如果程序在 Linux 下运行，请安装微软雅黑字体，否则会出现图片中文字显示异常的情况

该功能处于测试阶段，并且由于 OCR 的原因，有可能会出现漏识别词条的情况

建议配置并使用百度或腾讯的 OCR，识别率和正确率都比 ocr.space 高

如果有好的建议，例如结果排版设计等，特别是有没有免费且识别效果更好的 OCR API，欢迎提交 issue 告知

干员数据来自 [graueneko.github.io](https://github.com/graueneko/graueneko.github.io/blob/master/akhr.json)

数据每天都会更新一次，你也可以向机器人私聊发送`--update-akhr`来手动更新

## 感谢以下项目（不分先后）

- [saucenao](https://saucenao.com)
- [ascii2d](https://ascii2d.net)
- [WhatAnime](https://trace.moe) ([GitHub](https://github.com/soruly/trace.moe))
- [CoolQ HTTP API](https://cqhttp.cc) ([GitHub](https://github.com/richardchien/coolq-http-api))
- [node-cq-websocket](https://github.com/momocow/node-cq-websocket)
- [酷Q](https://cqp.cc)

# 更新日志（旧）

## 2023

### 12-08 v3.15.7

- 修复哔哩哔哩普通动态正文没有清理链接参数的问题
- 修复没有正确解析哔哩哔哩直播动态的问题

### 11-27 v3.15.6

- 修复 esm 问题

### 11-27 v3.15.5

- 优化 node modules 大小
- 增加 linux/arm64 docker 镜像
- 支持使用 [bun](https://bun.sh/) 运行

### 11-24 v3.15.4

- 优化 docker 镜像大小
- 搜图模式下可以切换至原图模式 [#443](../../issues/443)
- 发送消息允许不转义普通文本内容 [#448](../../issues/448)
- 配置项变更
  - A `bot.disableMessageEscape`

### 11-24 v3.15.3

- 修复 ghproxy 喜提 GFW 的问题
- 支持 docker 部署（大概）

### 10-11 v3.15.2

- 修复哔哩哔哩信息流推送可能重复推送的问题
- 修复哔哩哔哩动态解析发送的视频播放数和弹幕数可能为 NaN 的问题

### 10-06 v3.15.1

- 部分版本的QQ客户端发送的图片 go-cqhttp 暂时无法获取([go-cqhttp#2401](https://github.com/Mrs4s/go-cqhttp/issues/2401))，导致搜图错误，暂时先增加提示

### 09-25 v3.15.0

- 增加 `--get-url` 的别名 `链接`
- 增加转换原图功能，可用于解决后续版本手Q将不支持保存自定义表情的问题(🖕🏻fuck you qq)，手机在群里回复带有自定义表情的消息，@机器人并附带“原图”二字，机器人会将表情包以普通图片形式重新发送，使手Q可以保存
- 增加 VITS 全局默认模型设置 [#441](../../issues/441)
- 配置项变更
  - A `bot.vits.defaultModelId`

### 09-14 v3.14.6

- 修复哔哩哔哩解析和推送新版动态多张图只会发送第一张的问题

### 09-12 v3.14.5

- 修复哔哩哔哩解析和推送新版动态错误的问题
- 修复获取已失效的群文件下载链接会无响应的问题

### 08-27 v3.14.4

- 修复哔哩哔哩动态解析 -352 错误

### 08-04 v3.14.3

- 哔哩哔哩信息流推送过滤抽奖结果动态
- 修复哔哩哔哩信息流推送启用后无法推送直播的问题
- 哔哩哔哩信息流推送增加 cookie 过期提醒

### 07-21 v3.14.2

- 修复某些情况下搜本子出错的问题
- 哔哩哔哩支持新版动态 opus 类型解析
- 修复哔哩哔哩信息流推送可能漏推送或重复推送的问题

### 07-18 v3.14.1

- 修复检查更新失败的问题

### 07-18 v3.14.0

- 哔哩哔哩支持使用信息流推送，详见“wiki-附加功能-哔哩哔哩推送-信息流推送”
- 配置项变更
  - A `bot.bilibili.useFeed`
  - A `bot.bilibili.feedCheckInterval`
  - A `bot.bilibili.cookie`

### 07-17 v3.13.0

- 支持数组形式消息上报，即 go-cqhttp 的 post-format 配置不再要求为 `string`

### 06-26 v3.12.1

- 修复哔哩哔哩动态解析

### 06-08 v3.12.0

- 语言库可以指定只对某些用户或群组生效（详见 wiki）
- 增加群白名单设置
- 配置项变更
  - A `bot.whiteGroup`

### 06-05 v3.11.0

- 移除 yarn.lock 以免使用 npm >= 8 安装依赖时修改 yarn.lock 导致后续更新冲突
- 修复某些哔哩哔哩小程序分享没有触发解析的问题
- 允许在群组内使用管理员指令 [#427](../../issues/427)

### 05-12 v3.10.1

- 修复语言库多个回复项随机结果不正确的问题
- 修复部分情况下 VITS 模型列表有误的问题 [#423](../../issues/423)
- 修复哔哩哔哩动态无法解析 [#424](../../issues/424)
- vits-simple-api 默认语言优化 [#425](../../issues/425)

### 05-10 v3.10.0

- 语言库支持多个回复项 [#419](../../issues/419)
- 修复同时启用群内搜图私聊发送和合并转发时表现不正确的问题 [#421](../../issues/421)

### 04-27 v3.9.1

- 修复 vits-list 指令私聊时会触发默认回复的问题
- 修复 VITS 语音经常发送超时的问题
- 修复 iOS 无法播放收到的 VITS 语音的问题（需要安装 FFmpeg）

### 04-26 v3.9.0

- 新增 VITS 语音合成功能，详见 [wiki-附加功能-VITS](../../wiki/%E9%99%84%E5%8A%A0%E5%8A%9F%E8%83%BD#vits)
- 配置项变更
  - A `bot.vits`

### 04-14 v3.8.1

- 哔哩哔哩解析支持新版动态地址
- pixiv.net 绿了，移出红链黑名单

### 04-07 v3.8.0

- 语言库支持与其他功能进行联动，如 ChatGPT，详见 wiki-附加功能-语言库-联动其他功能 [#406](../../issues/406)
- ChatGPT 黑白名单支持使用 overrides 进行覆盖 [#407](../../issues/407)
- 修复方舟公招数据无法更新的问题 [#408](../../issues/408)

### 03-22 v3.7.1

- 修复无法搜索 Electron QQ 发出的图片的问题（需使用 go-cqhttp v1.0.0-rc5 及以上版本）

### 03-08 v3.7.0

- 哔哩哔哩解析支持对小程序分享解析成功后撤回原消息 [#397](../../issues/397)
- 哔哩哔哩解析增加群黑白名单配置
- 配置项变更
  - A `bot.bilibili.recallMiniProgram`
  - A `bot.bilibili.blackGroup`
  - A `bot.bilibili.whiteGroup`

### 03-04 v3.6.0

- 增加了选项可以设置从 nHentai 镜像站获取本子详情
- 优化了 saucenao 搜索本子的范围
- 配置项变更
  - A `bot.getDoujinDetailFromNhentaiMirrorSite`
  - M `bot.getDoujinDetailFromNhentai` 默认值变更为 `true`

### 03-02 v3.5.0

- ChatGPT 支持使用 Chat completion API 和新增的 gpt-3.5 模型
- 修复了 `bot.chatgpt.userDailyLimit` 不生效的问题
- 配置项变更
  - A `bot.chatgpt.useChatAPI`
  - A `bot.chatgpt.prependMessages`
  - M `bot.chatgpt.model` 默认值变更为 `gpt-3.5-turbo`
  - M `bot.chatgpt.maxTokens` 默认值变更为 `0`

注意：本次更新涉及到 ChatGPT 默认配置变动，新增配置项会与旧默认配置项存在冲突

- 如果你启用了 `autoUpdateConfig` 但是没有使用过该能力，建议删除 `bot.chatgpt` 配置让其重新自动生成
- 如果你已经在使用 ChatGPT
  - 如果你希望继续使用旧的模型与 Completion API，那么请配置 `useChatAPI` 为 `false`，未配置 `maxTokens` 的需要指定一个值（旧默认值为 `3072`）
  - 如果你希望使用新的 Chat completion API 和 gpt-3.5 模型，那么请将 `model` 和 `maxTokens` 配置还原为新的默认值（`maxTokens` 如有需求也当然可以自由设置）

### 02-25 v3.4.0

- 增加搜图反馈功能，可以在收到图片时回复以辅助判断图片有没有被屏蔽，默认关闭 [#393](../../issues/393)
- 配置项变更
  - A `bot.searchFeedback`
  - A `bot.replys.searchFeedback`

### 02-15 v3.3.0

- 修复使用群发功能带图时会触发搜图的问题
- ChatGPT 增加每名用户每日使用次数限制配置
- 配置项变更
  - A `bot.chatgpt.userDailyLimit`

### 01-14 v3.2.0

- 增加点赞功能（需要使用支持点赞的机器人客户端，原版 go-cqhttp 并不支持）
- ChatGPT 支持选项覆盖，可以匹配正则使用不同参数（详见 wiki）[#387](../../issues/387)
- 配置项变更
  - A `bot.like`
  - A `bot.chatgpt.overrides`

## 2022

### 12-17 v3.1.2

- 修复 ChatGPT 黑白名单不生效问题
- 优化 ChatGPT 回答多余字符过滤

### 12-17 v3.1.1

- 修复 ChatGPT prompt 可能含有非文本内容的问题

### 12-17 v3.1.0

- 修复 puppeteer 可能在 linux 中无法启动的问题
- 新增 ChatGPT 功能
- 配置项变更
  - A `bot.chatgpt`

### 12-11 v3.0.0

注意：本次升级请勿使用 `--update-cqps` 指令，而是手动执行以下命令

```bash
npm run kill # 如果你的 pm2 上存在其他程序不想 kill，也可以执行 npx pm2 delete cqps
npm run update
```

- BREAKING CHANGE: 项目完全转换为 esm，仅支持 node 14 及以上版本
- 处理 ascii2d 结果的红链
- 哔哩哔哩动态推送放宽旧动态的时间判定，以免审核时间过长导致被过滤而漏推送
- 支持使用 Puppeteer 绕过 cf js challenge 以解决 ascii2d 和 nHentai 的请求问题（见“wiki-配置文件说明-使用 Puppeteer 绕过 cf js challenge”）
- 配置项变更
  - A `bot.ascii2dUsePuppeteer`
  - A `bot.nHentaiUsePuppeteer`

### 11-19 v2.42.0

- 将 `pixiv.net` 加入红链处理名单（否则有概率被屏蔽）
- 使用新的红链处理方式，可以发出完整链接，只需手动复制到浏览器打开即可，不需要手动删除字符，大部分主流浏览器都可以正常打开（Chrome/Safari/Edge等）
- 如需照顾少数无法正常打开链接的浏览器，请设置 `bot.handleBannedHostsWithLegacyMethod` 为 `true`
- 为方便复制链接，移除 `Source:` 文字
- 配置项变更
  - A `bot.handleBannedHostsWithLegacyMethod`

### 11-13 v2.41.0

- 哔哩哔哩推送支持视频列表（以前只支持视频合集，配置见 wiki）[#373](../../issues/373)

### 11-07 v2.40.2

- 修复哔哩哔哩动态内链接的处理问题 [#370](../../issues/370)
- 根据哔哩哔哩推送检测间隔过滤掉过旧的动态以免B站 API 抽风导致重复推送 [#370](../../issues/370)

### 10-31 v2.40.1

- 修复哔哩哔哩用户没有动态时添加推送会不停打印错误日志的问题 [#369](../../issues/369)
- 修复 `bot.handleBannedHosts` 配置没有生效的问题

### 10-29 v2.40.0

- 支持输出 ascii2d 人为提交的搜索结果 [#361](../../issues/361)
- 哔哩哔哩解析支持当原消息撤回时同步撤回解析结果（默认启用，可在配置中关闭）
- 配置项变更
  - A `bot.bilibili.respondRecall`

### 09-27 v2.39.6

- 修复有时候输出错误日志会发生额外错误的问题

### 09-27 v2.39.5

- 修复某些情况下 bot 会崩溃的问题

### 09-22 v2.39.4

- 修复哔哩哔哩直播会推送轮播的问题

### 09-22 v2.39.3

- 修复了哔哩哔哩直播推送失效的问题 [#360](../../issues/359)
- 搜图结果合并转发中附带的原图也会按照 `bot.antiShielding` 进行反和谐处理

### 09-10 v2.39.2

- 优化了方舟公招计算识别，现在不需要特地选中高资或资深了，大概 [#359](../../issues/359)
- 修复了方舟公招计算高资和资深提示背景异常的问题

### 09-09 v2.39.1

- 过滤直播推送链接参数 [#358](../../issues/358)
- 优化错误日志输出

### 08-28 v2.39.0

- 图片反和谐支持组合方式，详见配置注释
- 支持对搜图结果缩略图进行反和谐
- 目前发现搜图结果中包含红链会导致消息无法发出，因此默认会对红链进行处理，可在配置中关闭
- nHentai 上了 cf 五秒盾导致无法搜索本子，因此 `bot.getDoujinDetailFromNhentai` 默认值改为 `false`，并建议关闭
- 配置项变更
  - A `bot.antiShielding`
  - A `bot.handleBannedHosts`
  - M `bot.getDoujinDetailFromNhentai`
  - M `bot.setu.antiShielding`

### 07-21 v2.38.0

- 由于历史原因，机器人硬编码忽略了 `/` 与 `<` 开头的发言以兼容同时部署了其他机器人的情况，现将这一功能提至配置项 `bot.regs.ignore`，默认为 `""` 即不进行忽略，如有需要请在更新后设置此项 [#344](../../issues/344)
- 配置项变更
  - A `bot.regs.ignore`

### 07-11 v2.37.2

- 哔哩哔哩解析被删除的动态或视频时增加回复提示 [#336](../../issues/336)
- 更改部分功能使用到的 jsdelivr 域名防止国内部分地区无法访问 cdn.jsdelivr.net => fastly.jsdelivr.net

### 07-10 v2.37.1

- 修复哔哩哔哩动态解析问题 [#339](../../issues/339)

### 07-08 v2.37.0

- 哔哩哔哩推送动态支持只推送视频 [#335](../../issues/335)
- 哔哩哔哩推送支持视频合集 [#335](../../issues/335)
- 配置项变更
  - M `bot.bilibili.push`（见 wiki）

### 07-04 v2.36.1

- 哔哩哔哩动态解析支持投票 [#333](../../issues/333)
- `--update-cqps` 指令现会将更新过程日志保存到 `logs/update.log`
- 由于私聊回复（指 CQ:reply）存在 bug ([Mrs4s/go-cqhttp#1421](https://github.com/Mrs4s/go-cqhttp/issues/1421))，将暂时不会发送私聊的回复

### 06-25 v2.36.0

- setu 发送链接使用回复而不是 @
- 更新 @napi-rs/canvas 以支持一些旧版本 linux
- 支持私聊合并转发搜图结果（需要 go-cqhttp ≥ v1.0.0-rc2，且目前因为有较多 bug 所以不推荐启用，建议等 go-cqhttp 修复）
- 支持对 saucenao 的 NSFW 结果隐藏缩略图
- 配置项变更
  - A `bot.hideImgWhenSaucenaoNSFW`
  - A `bot.privateForwardSearchResult`

### 06-20 v2.35.0

- 移除哔哩哔哩解析的视频搜索兜底以避免误触
- 增加 ascii2d 本地上传搜索功能开关（默认关闭，使用在线 URL API），或许可以解决某些情况下的搜索问题吧，我也不好说（
- 配置项变更
  - A `bot.ascii2dLocalUpload`

### 06-10 v2.34.8

- 修复 ascii2d 搜索失败问题

### 06-10 v2.34.7

- 修复 WhatAnime 不能得到正确搜索结果的问题  [#321](../../issues/321)

### 06-05 v2.34.6

含重要漏洞修复，请务必更新

- setu 对管理者私聊不做限制 [#318](../../issues/318)
- 修复外部文本可注入 CQ 码的问题 [#320](../../issues/320)

### 05-29 v2.34.5

- 哔哩哔哩动态解析支持音频类型 [#317](../../issues/317)

### 05-26 v2.34.4

- 修复哔哩哔哩短链接无法解析的问题  [#315](../../issues/315) [#316](../../issues/316)

### 05-21 v2.34.3

- 哔哩哔哩动态解析支持 4200 和 4308 类型 [#314](../../issues/314)
- 哔哩哔哩动态解析会尝试去除正文中的链接的一些垃圾参数

### 05-18 v2.34.2

- setu 增加群组黑名单配置 [#304](../../issues/304)
- 配置项变更
  - A `bot.setu.blackGroup`

### 05-14 v2.34.1

- 哔哩哔哩解析动态中的视频增加详细信息 [#310](../../issues/310)

### 03-12 v2.34.0

- 修复哔哩哔哩解析可能使用非视频标题进行视频搜索的问题
- setu 可以设置不发送链接 [#302](../../issues/302)
- r18 setu 只发链接功能增加对频道的设置
- 哔哩哔哩推送可以设置@全员，详见 wiki [#293](../../issues/293)
- 配置项变更
  - A `bot.setu.sendUrls`
  - A `bot.setu.r18OnlyUrl.guild`
  - A `bot.bilibili.push.*.*.dynamicAtAll`
  - A `bot.bilibili.push.*.*.liveAtAll`

### 03-05 v2.33.7

- 哔哩哔哩解析支持结构化消息 [#300](../../issues/300)

### 03-05 v2.33.6

- 增加 `.npmrc` 默认启用 `legacy-peer-deps` 以解决 npm v7 以上可能出现 peer dependencies 冲突的问题
- 明日方舟公招计算器增加“资深干员”和“高级资深干员”无法被识别时的处理提示

### 02-26 v2.33.5

- 修复还是没有完全修好的 ascii2d 无法使用的问题 [#283](../../issues/283)
- 配置项变更
  - A `bot.cfTLSVersion`

### 02-26 v2.33.4

- 修复没有完全修好的 ascii2d 无法使用的问题 [#283](../../issues/283)

### 02-26 v2.33.3

- 修复 ascii2d 无法使用的问题，感谢 @DiheChen [#283](../../issues/283)
- `bot.useAscii2dWhenQuotaExcess`, `bot.useAscii2dWhenLowAcc`, `bot.useAscii2dWhenFailed` 的默认值变更回 `true`
- 更新了一些依赖的版本

### 02-18 v2.33.2

- 修复部分参数在特定情况下无法正常解析的问题 ([#292](../../issues/292))

### 02-13 v2.33.1

- 在频道发送的 setu 无法撤回，是已知现象，go-cqhttp 尚未支持撤回频道消息 ([#290](../../issues/290))
- 由于频道监管较严，默认禁止在频道请求 r18 setu ([#291](../../issues/291))
- 配置项变更
  - A `bot.setu.r18AllowInGuild`

### 02-12 v2.33.0

- 增加频道支持，详情请看 [wiki](../../wiki/%E9%A2%91%E9%81%93%E6%94%AF%E6%8C%81)
- 检查更新改为使用 GitHub API，不再依赖 isomorphic-git
- 由于 [#283](../../issues/283) 尚未解决，因此 `bot.useAscii2dWhenQuotaExcess`, `bot.useAscii2dWhenLowAcc`, `bot.useAscii2dWhenFailed` 的默认值更改为 `false`
- 配置项变更
  - A `bot.adminTinyId`
  - A `bot.enableGuild`

### 02-04 v2.32.1

- 该版本无内容更新，仅为公告用途
- 近期请勿启用 `bot.pmSearchResultTemp` 功能，通过 go-cqhttp 发送群临时会话很可能导致账号冻结，详情请关注 https://github.com/Mrs4s/go-cqhttp/issues/1338

### 01-08 v2.32.0

- 悲报：ascii2d 因上了 CF，机器人请求可能会被 JS Challenge 拦截，目前没有找到解决方法，如频繁出现 403 错误请将 `bot.useAscii2dWhenQuotaExcess`, `bot.useAscii2dWhenLowAcc`, `bot.useAscii2dWhenFailed` 设为 `false`；如您有好的解决方案请前往 [#283](../../issues/283) 献言献策，谢谢
- 增加自定义 canvas 库的能力，如本项目默认使用的 [@napi-rs/canvas](https://www.npmjs.com/package/@napi-rs/canvas) 出现异常，可切换至使用 [canvas](https://www.npmjs.com/package/canvas)，详情见 wiki
- 配置项变更
  - A `bot.canvasLibrary`

### 01-03 v2.31.2

- 修复可能因B站抽风而重复推送动态的问题 ([#281](../../issues/281))
- 更新了一些依赖的版本

### 01-01 v2.31.1

- 新年快乐！
- 改进了B站动态推送检测机制，减少漏动态问题
- 新增支持解析类型为 2048 的B站动态

## 2021

### 10-24 v2.31.0

- 新增B站动态、直播推送功能
- 新增 `npm run update` 脚本用于一键更新，会自动判断包管理器，如果目录中存在 `package-lock.json` 则使用 `npm`，否则使用 `yarn`
- 新增管理者私聊指令 `--update-cqps` 用于远程一键更新，该更新方式是实验性的，建议在可以登上服务器的状态下使用，以免出现意外起不来（
- 修复 go-cqhttp v1.0.0-beta8 及以上版本无法回复搜图的问题 by @Magic-Xin
- 修复无法解析B站手机客户端分享的动态短链的问题
- 配置项变更
  - A `bot.replys.push`
  - A `bot.replys.pushCheckInterval`

### 10-24 v2.30.3

- 因 pixiv.cat 在大陆被墙，`bot.setu.sendPximgProxies` 默认配置变更为 `["https://i.pixiv.re/"]`；设置了 `bot.setu.pximgProxy` 的用户也请注意修改
- setu 使用在线反代时，如果设置了代理，反和谐会走代理下载图片；不反和谐时仍由 go-cqhttp 下载图片，这种情况下如果需要走代理，需要给 go-cqhttp 配置代理

### 10-24 v2.30.2

- 搜图结果中的预览缩略图将主动下载后再发送 by @NekoAria

### 10-06 v2.30.1

- 增加对B站专栏手机版链接的识别
- 更新一些依赖

### 08-26 v2.30.0

- 更新 pm2 至 v5.1.1，如需更新内存中的 pm2 版本，请在本次更新完后启动之前执行一次 `npm run kill`
- 使用无系统依赖的 [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) 代替 [node-canvas](https://github.com/Automattic/node-canvas)
- 可使用 `.env` 配置环境变量，用于某些特殊情况 ([#239](../../issues/239))
- 新增 `update:npm` 和 `update:yarn` 两个 npm 脚本，一键更新本项目

### 08-22 v2.29.15

- 哔哩哔哩视频解析防刷屏改进 ([#235](../../issues/235))
- 增加 ascii2d 错误原因的输出 ([#238](../../issues/238))

### 07-28 v2.29.14

- 修复一些 saucenao 错误原因的判断 ([#232](../../issues/232))

### 07-24 v2.29.13

- ascii2d 出现“first byte timeout”错误时进行重试 ([#227](../../issues/227))

### 07-01 v2.29.12

- 修复 setu 不能 r18 的问题

### 06-26 v2.29.11

- setu 使用 API v2，keyword 支持使用 & 和 |（详见 wiki），且不再需要 API Key
- 修复特定情况下 nhentai 搜不到本子的问题
- QQ OCR 增加重试机制，避免偶然抽风
- 完善 saucenao 中图源、标题、作者的获取
- 配置项变更
  - A `bot.replys.setuNotFind` 没有符合条件 setu 时的回复

### 06-05 v2.29.10

- 修复 ascii2d 搜索失败仍会缓存结果的问题 ([#202](../../issues/202))
- 修复特定情况下 OCR 抛出异常的问题 ([#203](../../issues/203))

### 05-29 v2.29.8

- 提升本子搜索成功率
- 修复一些问题

### 05-29 v2.29.7

- 对 saucenao 的 pixiv 结果进行权重处理 ([#199](../../issues/199))

### 05-29 v2.29.6

- 修正搜图和 setu 的配额机制，防止绕过限制 ([#200](../../issues/200))
- 语言库支持使用 `[CQ:delete]` 撤回对方消息
- 修正方舟公招计算器结果图中英文和数字的文字基线

### 05-28 v2.29.5

- 修复可能出现 saucenao 搜图 404 的问题 ([#198](../../issues/198))

### 05-27 v2.29.4

- 修复群聊 saucenao 搜索结果异常的问题 ([#195](../../issues/195))
- 修复部分情况下会缓存失败搜索结果的问题

### 05-25 v2.29.3

- 修复部分情况下可能出现文件不存在错误的问题（不影响程序正常运行）
- whatanime 发送预览视频不再需要依赖 ffmpeg
- 改进方舟公招计算器的识别逻辑
- 默认 OCR 服务变更为为 qq
- `bot.setu.pximgProxy` 和 `bot.setu.sendPximgProxies` 新增支持一些占位符
- 配置项变更
  - M `bot.ocr.use` 默认值 `"ocr.space"` -> `"qq"`
  - M `bot.akhr.ocr` 默认值 `"ocr.space"` -> `"qq"`

### 05-23 v2.29.2

- 改进方舟公招计算器生成图片的效果 ([#193](../../issues/193))
- 新增 `autoUpdateConfig` 配置，可自动按照 `config.default.json` 来更新 `config.json`
- 配置项变更
  - A `autoUpdateConfig`

### 05-23 v2.29.1

修复找不到模块问题，若先前更新过 v2.29.0，更新到最新版时请按以下步骤操作

```bash
git reset v2.29.0 --hard
git pull # 可能会报错，不用管
git reset v2.29.1 --hard
git pull
```

### 05-23 v2.29.0

- 修复了 `bot.setu.r18OnlyUrl` 导致非 r18 图也只发 url 的问题 ([#182](../../issues/182))
- 更新了 trace.moe API，解决了无法发送预览视频的问题
- `bot.setu.r18OnlyUrl` 分开群聊、私聊、临时会话（⚠️需要更新配置） ([#183](../../issues/183))
- 定时提醒可通过添加 `--origin` 参数使内容不被 CQ 转义，见 [wiki](../../wiki/%E9%99%84%E5%8A%A0%E5%8A%9F%E8%83%BD#%E9%98%B2%E6%AD%A2-cq-%E8%BD%AC%E4%B9%89) ([#178](../../issues/178))
- 可以使用 reminder 定时发送 setu，见 [wiki](../../wiki/%E9%99%84%E5%8A%A0%E5%8A%9F%E8%83%BD#setu-1) ([#174](../../issues/174))
- 配置项变更
  - M `bot.whatanimeHost` 默认值 `"trace.moe"` -> `"api.trace.moe"`（旧值在读取时会被自动替换为新值）
  - M `bot.setu.r18OnlyUrl` 默认值 `false` -> `{ "private": false, "group": false, "temp": false }`，如先前修改为 `true` 请更新配置，否则会变为新默认值

### 05-19 v2.28.5

- 修复了 `bot.setu.pximgServerHost` 设置无效的问题
- 弃用了一些已经不可用的短链接服务

### 05-17 v2.28.4

- 修复了可能出现 pm2 占用内存过多的问题
- ⚠️本次更新前请在程序目录下执行 `npx pm2 delete CQPF`，不需要执行 `npm stop`，其他步骤相同

### 05-16 v2.28.3

- 修复“允许通过临时会话私聊发送”相关功能可能无效的问题

### 05-16 v2.28.2

- 修复 pximg 反代服务启动问题
- pximg 反代服务默认只在本地(`127.0.0.1`)监听，如有需要请更改 `bot.setu.pximgServerHost`
- 配置项变更
  - A `bot.setu.pximgServerHost`

### 05-16 v2.28.1

- 修复 `bot.setu.shortenPximgProxy` 默认值

### 05-16 v2.28.0

- [#175](../../pull/175) by @niceRAM
  - 允许通过临时会话私聊发送搜图结果
  - 可配置 r18 setu 仅通过私聊发送（默认开启，如不需要请修改配置）
  - 允许 r18 setu 通过临时会话私聊发送
  - 发送 setu 链接时可以追加若干个原图镜像链接
  - 可配置对原图镜像链接做短链接处理（增加 oy.mk 短链接服务 by @Quan666）
- pximg 反代服务默认使用随机可用端口号（老用户可手动将 `bot.setu.pximgServerPort` 设置为 `0`）
- 配置项变更
  - M `bot.setu.pximgServerPort` 默认值 `60233` -> `0`
  - A `bot.pmSearchResultTemp`
  - A `bot.setu.sendPximgProxies`
  - A `bot.setu.shortenPximgProxy`
  - A `bot.setu.r18OnlyUrl`
  - A `bot.setu.r18OnlyPrivate`
  - A `bot.setu.r18OnlyPrivateAllowTemp`

### 05-12 v2.27.1

- 使用方舟公招计算器将不再需要自行安装字体

### 05-11 v2.27.0

- 搜图缓存使用文件缓存代替 sqlite 以节省内存，注意：`data/db.sqlite` 将会被删除

### 05-05 v2.26.1

- 使用 go-cqhttp 的场合下，whatanime 支持发送预览视频的功能需要自行安装 [ffmpeg](https://ffmpeg.org/download.html) 才可以使用
- 配置项变更
  - M `bot.whatanimeSendVideo` 默认变更为 `false`

### 05-05 v2.26.0

- whatanime 支持发送预览视频
- 配置项变更
  - A `bot.whatanimeSendVideo`

### 04-25 v2.25.0

- 定时提醒支持重载了（方便手动修改 `data/rmd.json`）
- 【重要】方舟公招计算器数据格式变更，不更新此版本将无法更新数据
- 方舟公招计算器支持配置定时自动更新
- 获取群文件直链命令支持含空格的文件 ([#169](../../issues/169))
- 哔哩哔哩解析支持 bili2233.cn 短链 ([#170](../../issues/170))
- 配置项变更
  - A `bot.akhr.updateInterval`

### 04-05 v2.24.1

- 修复哔哩哔哩解析无法解析 b23 / acg 短链接的问题

### 04-04 v2.24.0

- 【反哔哩哔哩小程序】模块更名为【哔哩哔哩解析】模块，并增加动态、专栏、直播间的解析 (thanks @NekoHina)
- 配置项变更
  - M `bot.antiBiliMiniApp` -> `bot.bilibili`：仍兼容旧字段
  - A `bot.bilibili.getDynamicInfo`
  - A `bot.bilibili.getArticleInfo`
  - A `bot.bilibili.getLiveRoomInfo`

### 03-22 v2.23.2

- 更新检查不再依赖本地 git

### 03-21 v2.23.1

- 修复将 `bot.admin` 设置为机器人自己时会无限发言的问题 ([#152](../../issues/152))

### 03-13 v2.23.0

- 在某张图的搜索过程中收到的同一张图片的搜图请求将会等待搜索结束后直接使用同一搜索结果 ([#136](../../issues/136))
- 搜索未结束时在相同场景下收到同一张图片的搜图请求将会直接返回提示语 `bot.replys.searching` ([#136](../../issues/136))
- 搜图模式结束后若未收到过图片则会发送提醒 ([#136](../../issues/136))
- 可选使用合并转发发送搜图结果 `bot.groupForwardSearchResult` ([#136](../../issues/136))
- 可能修复了有时候发出的搜图结果图片上传失败的问题
- 配置项变更
  - A `bot.replys.searching`
  - A `bot.groupForwardSearchResult`

### 03-12 v2.22.5

- 修复 whatanime 搜索失败问题

### 03-08 v2.22.4

- 尽可能排除 pixiv 盗图结果 by @NekoAria

### 02-17 v2.22.3

- 修复 whatanime 搜索失败问题

### 02-15 v2.22.2

- 修复更新检测逻辑 ([#142](../../issues/133))

### 02-09 v2.22.1

- 定时提醒支持设置精华消息 (go-cqhttp ≥ v0.9.40)，详见 wiki

### 01-25 v2.22.0

- `ocr_image` API 移除实验模式，如有使用请将 go-cqhttp 升级到 v0.9.34 以上
- 可设置 saucenao 在搜到本子时是否进一步去 nhentai 搜索（默认是，与之前的行为一致，若没有特殊需求不需要动该设置）([#134](../../issues/134))
- 配置项变更
  - A `bot.getDoujinDetailFromNhentai`

### 01-25 v2.21.9

- 修复 whatanime 无法使用的问题 ([#133](../../issues/133))

### 01-21 v2.21.8

- 修复配置读取问题

### 01-21 v2.21.7

- 修复配置热重载不能重载 `saucenaoApiKey` 的问题
- saucenao 搜索失败可自动使用 ascii2d
- 移除旧的 npm script `pm2*`
- 配置项变更
  - A `bot.useAscii2dWhenFailed`

## 2020

### 12-31 v2.21.6

- 不再对红链进行短链接处理 ([#124](../../issues/124))
- sqlite3 依赖升级至 5.0.0 使 node 14 能够下载 prebuilt

### 12-17 v2.21.5

- 忽略回复机器人消息的消息

### 12-15 v2.21.4

- 搜图增加 `--all` 参数，使得设置了其它默认搜图库时可以靠参数使用全库搜索
- 修复输出的更新日志可能过时的问题
- 会输出大于本地版本的所有更新日志
- 配置项变更
  - M `bot.checkUpdate` 单位变更为小时

### 12-15 v2.21.3

- 修复检查更新间隔不正确的问题

### 12-15 v2.21.2

- 新增忽略QQ官方机器人的能力，防止共用时意外对线
- 配置项变更
  - A `bot.ignoreOfficialBot`

### 12-14 v2.21.1

- 修复群消息不响应的问题 ([#116](../../issues/116))

### 12-13 v2.21.0

- 调整检查更新的时机
- 群内支持通过回复来使用搜图等与图片相关的功能 (go-cqhttp ≥ v0.9.32)
- 新增获取群文件下载直链的功能 (go-cqhttp ≥ v0.9.32)

### 12-07 v2.20.5

- 修复部分情况下检查更新出错的问题
- 完善 setu 反和谐失败的提示

### 12-06 v2.20.4

- 修复极端情况下可能导致定时提醒出现较大误差的问题

### 12-03 v2.20.3

- 修复因 setu 原图过大而无法反和谐的问题

### 12-03 v2.20.2

- 修复检查更新功能
- 修复在搜图模式下指定图库为 anime 时不会用 whatanime 搜索的问题

### 11-23 v2.20.1

- 修复明日方舟公招计算器不识别资深和高资的问题（需要私聊 `--update-akhr` 更新数据）

### 11-23 v2.20.0

- 配置文件变更为 jsonc 格式以支持注释（用户无需进行额外操作）

### 11-08 v2.19.1

- 修复发图片时多一个 `]` 的问题

### 11-08 v2.19.0

- 支持 QQ OCR（需要 go-cqhttp ≥ v0.9.26）
- 新增将 setu 逆时针旋转90°的反和谐方式（`bot.setu.antiShielding = 2`）
- setu 支持以闪照形式发送
- 定时检查更新
- 明日方舟公招数据源变更为 [arkntools/arknights-toolbox](https://github.com/arkntools/arknights-toolbox)
- 配置项变更
  - A `bot.checkUpdate`
  - M `bot.setu.antiShielding`：类型由 `Boolean` 更改为 `Number`，会自动迁移
  - M `bot.setu.deleteTime` `bot.setu.whiteDeleteTime`：`-1` 为发送闪照
  - M `bot.ocr.use` `bot.akhr.ocr`：支持 `qq`

### 09-13 v2.18.1

- 修复消息群发失效 ([#101](../../issues/101))

### 09-12 v2.18.0

- 增加[语言库](../../wiki/%E9%99%84%E5%8A%A0%E5%8A%9F%E8%83%BD#%E8%AF%AD%E8%A8%80%E5%BA%93%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D)功能（自动回复）
- 配置项变更
  - A `bot.corpus`

### 09-11 v2.17.1

- 支持`[CQ:json]` ([#100](../../issues/100))

### 09-05 v2.17.0

- 支持[配置热重载](../../wiki/%E5%A6%82%E4%BD%95%E9%A3%9F%E7%94%A8#%E9%85%8D%E7%BD%AE%E7%83%AD%E9%87%8D%E8%BD%BD)
- 改进定时提醒的逻辑
- 修复机器人手动入群后没有文字反馈的问题

### 09-05 v2.16.1

- 修复 JSON 转义问题导致的哔哩哔哩小程序识别错误 ([#96](../../issues/96))
- 改进 nHentai 搜索

### 08-27 v2.16.0

- 增加搜图结果发送缩略图相关的详细设置 ([#90](../../issues/92))
- 配置项变更
  - M `bot.saucenaoHideImgWhenLowAcc` -> `bot.hideImgWhenLowAcc`：会自动迁移，无需手动更改
  - A `bot.hideImg`
  - A `bot.hideImgWhenWhatanimeR18`

### 08-17 v2.15.4

- 修复定时提醒 interval 超出 32 位有符号整数导致的刷屏问题 ([#90](../../issues/90))

### 08-16 v2.15.3

- 修复反 Bilibili 小程序会响应动态的小程序分享的问题 ([#89](../../issues/89))

### 08-15 v2.15.2

- 修复反 Bilibili 小程序的防刷屏逻辑问题 ([#87](../../issues/87))
- 搜图参数及图库关键字中的`book`修改为`doujin`，但`book`依然可用

### 08-14 v2.15.1

- 为`config.json`增加`$schema`
- 恢复群发消息功能 ([#86](../../issues/86))

### 08-13 v2.15.0

- 完全恢复转义，需使用 go-cqhttp v0.9.18 及以上版本
- 在群内发送搜图结果将会采用回复的形式 ([#84](../../issues/84))
- 启动时会检查配置文件是否存在以及 JSON 合法性
- 可独立开关私聊和群组消息的监听
- 配置项变更
  - M `picfinder` -> `bot`，会自动迁移，无需手动更改
  - A `bot.enablePM`
  - A `bot.enableGM`

### 08-10 v2.14.3

- 恢复部分转义，需使用 go-cqhttp v0.9.16 及以上版本

### 08-07 v2.14.2

- 因 go-cqhttp 尚未支持转义 [Mrs4s/go-cqhttp#9](https://github.com/Mrs4s/go-cqhttp/issues/9)，因此暂时禁用了消息的转义，待其修复后需要更新 go-cqhttp 和本项目

### 08-07 v2.14.1

- 之前忘记删除签到（点赞）相关功能代码了

### 08-05 v2.14.0 **R.I.P. CoolQ**

- 目前决定专注于适配 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp)，其余方案暂不考虑
  - mirai-native + cq-http 经测试仍然有很多问题且部署麻烦，因此放弃
  - 如果发现某些功能运作不正常或与原先表现不一致，可提 issue 向我反馈
- 请参考 wiki 进行迁移或部署，另外，配置文件结构有些许变动（主要是 node-cq-websocket 部分），请注意修改
- mirai 不支持点赞，自动点赞功能及相关配置项已被删除

### 07-30 v2.13.5

- 自定义每日资料卡点赞名单
- 配置项变更
  - A `bot.dailyLike`

### 07-24 v2.13.4

- 反 Bilibili 小程序功能在 3 分钟内将不会重复解析同一视频链接，以防刷屏

### 07-06 v2.13.3

- 增加 setu API 超额时的自定义回复
- 配置项变更
  - A `bot.replys.setuQuotaExceeded`

### 07-02 v2.13.2

- 修复定时提醒的逻辑错误

### 06-27 v2.13.1

- 修复搜图缓存没有正常运作的问题

### 06-27 v2.13.0

- 修复提醒功能失效问题 ([#75](../../issues/75))
- 弃用 mysql，仅使用 sqlite，配置项转移
- 配置项变更
  - D `mysql`
  - A `bot.cache`
  - `mysql.enable` -> `bot.cache.enable`
  - `mysql.expire` -> `bot.cache.expire`

### 5-10 v2.12.6

- 修复一个 bug

### 5-10 v2.12.5

- 修复方舟公招数据更新问题

### 5-05 v2.12.4

- 增加私聊回复群聊中搜图结果的功能 ([#60](../../issues/60))
- 配置项变更
  - A `bot.pmSearchResult`

### 5-01 v2.12.3

- 反哔哩哔哩小程序不支持番剧链接，将尽可能忽略番剧链接 ([#59](../../issues/59))

### 4-29 v2.12.2

- 更新方舟公招数据来源

### 4-29 v2.12.1

- 修正 debug 逻辑 ([#58](../../issues/58))

### 4-27 v2.12.0

- 增加“反哔哩哔哩小程序”功能，鼓励发链接，发链接时会自动获取视频信息并发送，详情看 wiki 配置说明及附加功能
- 配置项变更
  - A `bot.antiBiliMiniApp`

### 4-24 v2.11.14

- 更改公开招募计算器触发词，不再需要`--akhr`，改为包含`akhr`或`公招`一词即可

### 4-11 v2.11.13

- 修复 danbooru 获取原图来源问题

### 3-18 v2.11.12

- 修复 whatanime 错误 ([#54](../../issues/54))
- 改进错误输出

### 3-18 v2.11.11

- 修复反和谐生成图片过大问题 ([#53](../../issues/53))

### 3-17 v2.11.10

- 修复定时提醒功能判断分钟级间隔有误的问题

### 3-14 v2.11.9

- 更换 akhr 数据地址 ([#49](../../issues/49))
- 增加 whatanime 的 token 设置
- 配置项变更
  - A `whatanimeToken`

### 3-9 v2.11.8

- 增加 setu 的 apikey 设置
- 配置项变更
  - A `bot.setu.apikey`

### 2-21 v2.11.7

- 修复通用处理完成后未停止事件传播的问题 ([#36](../../issues/36))

### 2-18 v2.11.6

- WhatAnime 使用官方提供的 API

### 2-03 v2.11.5

- 增加 SauceNao 低相似度值自定义配置
- 增加“SauceNao 结果相似度过低时结果缩略图的替代文字”的配置
- 配置项变更
  - A `bot.saucenaoLowAcc`
  - A `bot.replys.lowAccImgPlaceholder`

### 2-01 v2.11.4

- 增加“SauceNao 结果相似度过低时隐藏结果缩略图”的配置
- 配置项变更
  - A `bot.saucenaoHideImgWhenLowAcc`

### 1-29 v2.11.3

- 增加对`http://www.pixiv.net/(artworks|users)/[0-9]+`链接的短缩

### 1-21 v2.11.2

- 增加配置项用于控制是否在 saucenao 结果低相似度或配额耗尽时使用 ascii2d
- 配置项变更
  - A `bot.useAscii2dWhenQuotaExcess`
  - A `bot.useAscii2dWhenLowAcc`

### 1-15 v2.11.1

- 因酷Q不支持本地发送大于 4M 的图片，因此开启反和谐后如果没有开启 size1200 并且原图大小超过 3M，将会自动使用 size1200 ([#40](../../issues/40))

## 2019

### 12-18 v2.11.0

- 当 ascii2d 失败时返回错误信息
- 支持自定义 ascii2d 的域名
- saucenao, whatanime, ascii2d 的自定义域名支持带上协议，即支持以下写法
  - `example.com`：将会使用`http://example.com`；特殊地，上面三者的官方域名将会使用 https
  - `http://example.com`或`https://example.com`
- 支持[群发消息](../../wiki/%E5%A6%82%E4%BD%95%E9%A3%9F%E7%94%A8#%E7%BE%A4%E5%8F%91%E6%B6%88%E6%81%AF)
- 配置项变更
  - A `ascii2dHost`

### 12-09 v2.10.1

- 增大 setu 反和谐力度
- 支持获取 yande.re 结果的原出处
- 增加`--help`,`--about`,`--version`命令

### 12-02 v2.10.0

- setu 反和谐
- 配置项变更
  - A `bot.setu.antiShielding`

### 11-05 v2.9.5

- 在 ascii2d 搜索失败时返回失败提示语 #31

### 10-29 v2.9.4

- 使用 named-regexp-groups 模块以解决某些 node 版本莫名其妙无法使用命名正则表达式捕获组的问题
- 搜图错误时的回复增加了 saucenao host index

### 10-25 v2.9.3

- 支持发送 master1200 大小的 setu 以改善小水管或国内机器发图速度
- 配置项变更
  - A `bot.setu.size1200`

### 10-22 v2.9.2

- 修复 admin 搜图时的记录问题
- 修复 npm 脚本错误
- 改善 setu 正则表达式

### 10-15 v2.9.1

- 增加 pm2 配置文件，目前可直接使用`pm2 start|stop|restart|logs`等命令控制
- 增加按关键词发 setu 以及 r18 setu 功能，若从旧版本升级，请参考 wiki 中 setu 功能说明进行设置
- 配置项变更（重要）
  - A `bot.setu.r18OnlyInWhite`
  - M `bot.regs.setu`

### 08-21 v2.8.0

- 增加对提醒功能最小提醒间隔的限制，新增配置项支持限制使用场景
- 提醒功能的 cron 表达式变更为使用分号分隔
- 增加设置项`bot.proxy`，支持使用 http 或 socks 代理

### 08-21 v2.7.2

- 增加连接错误的输出
- 对红名链接做 is.gd 短链接处理并使用防红名跳转

### 08-16 v2.7.1

- 对红名链接做 t.cn 短链接处理（在国外服务器上访问 API 有可能会有连接重置问题，已弃用）

### 08-16 v2.7.0

- 增加配置项`bot.saucenaoDefaultDB`，用于设置默认 saucenao DB
- 增加定时提醒功能，详见 README

### 08-01 v2.6.0

- 增加 SQLite 支持，增加设置项`mysql.sqlite`
- saucenao 配额耗尽后自动使用 ascii2d

### 07-07 v2.5.4

- 【腾讯 OCR】支持轮换 API 使用以变相提升免费额度
- 对【明日方舟公开招募计算器】的 OCR 增加了纠错
- 增加配置项
  - `bot.searchModeTimeout`
  - `bot.ocr.tencent.useApi`

### 07-02 v2.5.3

- 增加了【腾讯 OCR】的支持
- 增加了`bot.setu.pximgServerPort`和`bot.setu.usePximgAddr`设置项，以方便使用 Docker 版酷Q的用户

### 05-25 v2.5.2

- 增加了【百度 OCR】的支持，以提升对明日方舟公开招募词条的识别率和准确率
- **`ocr`部分的配置格式有改动，请参照新的`config.default.json`进行修改**
- 对【明日方舟公开招募计算器】进行了许多改进

### 05-24 v2.5.1

- `--add-group=`加群指令现在可以直接同意发送指令之前接收到的入群邀请了
- 对【明日方舟公开招募计算器】进行了许多改进

### 05-21 v2.5.0

- 加入【明日方舟公开招募计算器】功能，测试中

### 04-26 v2.4.0

- 增加对 ascii2d 的支持
- pixiv 结果会同时输出画师主页
- 对 danbooru 等标有原始来源的站点会自动获取原始链接
- 增加 OCR 功能
- 移除“文字模式”`textMode`设定，废弃使用分享形式发送结果的方式
- 对 WhatAnime 相关配置进行了调整，可参考新的`config.default.json`，但仍然兼容以前的配置方式

### 01-04 v2.3.2

- 增加检测问题回答加好友的机制

## 2018

### 12-05 v2.3.0

- 未在`config.json`中指定的配置将会使用`config.default.json`中的默认值
- 对 setu 功能进行了机制完善
- 稳定性提升

### 11-27 v2.2.1

一大堆改动，忘了写懒得补了 \_(:3」∠)\_

### 08-16 v2.1.0

- （暴力地）修复了当图片标题含有 emoji 时分享不正常的 bug
- 根据 @fuochai 的建议，将P站链接替换成短链接

### 07-16 v2.0.1

- 增加搜图模式下的搜图范围指定功能

### 06-06

- 修复了某些本子因含有特定符号而无法在 nhentai 搜索到（实际上 nhentai 有这本子

### 06-05

- 为了减少 API 的使用次数以及加快搜图速度，增加搜图缓存功能，某张图片（MD5 作为凭证）的搜索结果会被缓存指定时间，但可以用`--purge`参数无视缓存强制更新搜图结果
- 增加搜图次数限制功能

### 05-30

- 增加`--book`参数，用于指定搜索本子

### 05-19

- 增加`--danbooru`参数，用于指定搜索图库

### 03-22

- 改进了搜索结果表示
- 弃用`-s`和`-c`参数，使搜图监听模式的触发更人性化
- 使用`--anime`参数可以利用 whatanime 搜番（测试中，尚未作为正式功能，还有很大改进余地）

### 02-24

- 改进`-s`搜图的逻辑，现在可以进入搜图模式之后一直发图片进行查询，直到用`-c`参数退出

### 02-16

- 增加`-s`参数搜图模式，以应对类似“因转发图片至群里而无法@机器人”导致搜图过程复杂的问题

### 02-12

- 支持识别本子的搜索结果

### 01-23

- 搜图支持批量了

### 01-22

- 重写搜图结果识别方法与逻辑
- 修复了当图片不为消息最后一个内容时会导致无法搜图的 bug

### 01-21

初 版

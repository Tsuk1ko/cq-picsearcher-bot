# 更新日志

## 2025

### 10-04 v3.22.0

- B站视频链接解析分P
- 增加群成员备份功能，需手动启用，将每天备份群列表和群成员列表，意外炸群时可用于秽土转生
- 配置项变更
  - A `backupGroupMember`

### 10-02 v3.21.3

- 启用 `flaresolverr.enableForNHentai` 并使用原站搜本子时会错误的问题

### 10-02 v3.21.2

- 默认不销毁 FlareSolverr session
- 修复搜索本子时无法下载封面图的问题 [#494](../../issues/494)
- 配置项变更
  - A `flaresolverr.autoDestroySession`

### 10-01 v3.21.1

- 修复模块导入问题

### 10-01 v3.21.0

- 方舟公招计职业 tag 没有显示干员两个字
- 增大九宫图合并图片长宽上限
- 支持使用 [FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) 解决 ascii2d 或 nHentai 的 cf challenge [#493](../../issues/493)
- 移除 `bot.cfTLSVersion` 配置及相关能力
- 配置项变更
  - A `flaresolverr`
  - M `bot.getDoujinDetailFromNhentaiMirrorSite` 默认值 `"https://nhentai.xxx"` -> `""`
  - D `bot.cfTLSVersion`

### 06-08 v3.20.2

- 修复方舟公招计算漏掉了职业 tag 的问题

### 06-08 v3.20.1

- 方舟公招计算使用森空岛官方数据

### 05-03 v3.20.0

- 自定义 ChatGPT API 地址支持 override [#481](../../issues/481)
- 修复搜图缓存
- 更换 GitHub 反代地址，修复获取更新日志和下载方舟公招数据失败的问题
- 语言库支持回复和自定义正则 flag [#487](../../issues/487) [#488](../../issues/488)

### 02-15 v3.19.4

- 允许自定义 ChatGPT API 地址 [#481](../../issues/481)
- 配置项变更
  - A `bot.chatgpt.customAPI`
  - A `bot.chatgpt.customChatAPI`

### 02-14 v3.19.3

- setu 增加排除AI作品选项 [#480](../../issues/480)
- 配置项变更
  - A `bot.setu.excludeAI`

### 01-25 v3.19.2

- 修复B站直播链接解析错误问题

# 更新日志

## 2024

### 07-20 v3.17.5

- 修复B站动态解析无法发送含有图片的动态的问题 [#468](../../issues/468)

### 07-20 v3.17.4

- B站动态推送支持过滤转发自己的动态
- 修复可能出现的 `multimedia.nt.qq.com.cn` SSL 问题 [#467](../../issues/467)
- 修复 ascii2d 缩略图无法下载的问题
- 配置项变更
  - A `bot.bilibili.pushIgnoreForwardingSelf`

### 05-24 v3.17.3

- 修复腾讯云 OCR 错误的问题
- OCR 支持失败时使用其他 OCR 服务
- B站动态解析支持 `m.bilibili.com/opus`
- 配置项变更
  - A `bot.ocr.fallback`
  - A `bot.akhr.ocrFallback`

### 05-20 v3.17.2

- 修复开启 `bot.ascii2dLocalUpload` 时搜索错误的问题

### 05-17 v3.17.1

- 修复使用 Lagrange 时无法正确缓存搜图结果的问题 [#465](../../issues/465)

### 05-14 v3.17.0

- 修复哔哩哔哩动态推送过滤抽奖失效的问题
- 可禁止搜索过长图片 [#462](../../issues/462)
- 配置项变更
  - A `bot.stopSearchingHWRatioGt`
  - A `bot.replys.stopSearchingByHWRatio`

### 04-22 v3.16.7

- 修复消息上报格式为数组时回复搜图无法使用的问题

### 04-14 v3.16.6

- 哔哩哔哩动态推送视频去除播放量和弹幕数据（没用）

### 04-13 v3.16.5

- 哔哩哔哩长文动态增加全文链接
- 修复 LLOneBot 图片链接 [#455](../../issues/455)
- 改进哔哩哔哩动态宫格图合并逻辑

### 02-21 v3.16.4

- 修复无法解析哔哩哔哩专栏链接的问题（需要提供 cookie）

### 02-18 v3.16.3

- 修复无法获取 Lagrange.Core 接收到的图片的问题 [#454](../../issues/454)
- 配置项变更
  - M `bot.cfTLSVersion` 默认值 `TLSv1.1` -> `TLSv1.2`

### 01-17 v3.16.2

- docker 换用 node 镜像

### 01-12 v3.16.1

- 修复 docker 构建

### 01-12 v3.16.0

- 哔哩哔哩解析现在会使用 `bot.bilibili.cookie`，如果出现 `-352` 错误可以尝试提供 cookie
- 哔哩哔哩解析增加自动合并3/6/9宫格图的功能，可选开启，实验性，有误判可能
- 配置项变更
  - A `bot.bilibili.dynamicMergeImgs`

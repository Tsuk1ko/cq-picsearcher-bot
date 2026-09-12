# 更新日志

## 2026

### 09-12 v3.26.1

- 修复 SoutuBot 搜图

### 09-11 v3.26.0

- 支持按规则跳过复读 [#501](../../issues/501)
- 修复 nHentai 搜索获取缩略图失败的问题
- SoutuBot 获取 m 值失败时在日志输出响应内容
- 配置项变更
  - A `bot.repeat.maxWordNum`
  - A `bot.repeat.maxPicNum`
  - A `bot.repeat.allowMixed`
  - A `bot.repeat.allowLink`
  - A `bot.repeat.disallowReg`

### 08-30 v3.25.0

- 修复 SoutuBot 搜图可能出现 `Cannot read properties of null (reading 'data')` 报错的问题
- 对 SoutuBot 传入过大的图片自动进行压缩 [#500](../../issues/500)

### 07-20 v3.24.1

- 本地QQ图片路径不存在时回退到下载远程图片
- ascii2d 缩略图下载失败不再影响搜图结果
- 修复使用 FlareSolverr 时的图片图下载问题

### 06-28 v3.24.0

- 移除 Puppeteer 支持及相关选项，因为无用且不再维护
- 补充 SoutuBot 的 FlareSolverr 支持，但仍推荐优先使用 CloudflareBypassForScraping
- 修复B站动态合并九宫格功能
- 配置项变更
  - D `bot.ascii2dUsePuppeteer`
  - D `bot.nHentaiUsePuppeteer`
  - A `flaresolverr.enableForSoutuBot`

### 06-14 v3.23.1

- 修复 docker 构建

### 06-14 v3.23.0

- 支持 [CloudflareBypassForScraping](https://github.com/sarperavci/CloudflareBypassForScraping)
- 支持 [SoutuBot](https://soutubot.moe/) 本子搜索（使用 `--soutubot` 参数或私聊 `soutubot` 进入临时搜图模式）
- 修复 nHentai 搜索
- 配置项变更
  - A `cloudflareBypassForScraping`

FlareSolverr 现已无法解决 ascii2d cf 盾，可尝试 CloudflareBypassForScraping

本次版本更新了一些依赖，若出现某些功能异常的情况请提 issue 告知

### 06-06 v3.22.2

- B站动态图片合并九宫格跳过含透明像素的图（大多是表情）

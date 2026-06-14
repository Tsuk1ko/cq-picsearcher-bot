# 更新日志

## 2026

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

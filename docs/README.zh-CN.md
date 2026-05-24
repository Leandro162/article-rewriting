# Article Rewriting

一个面向公众号/教程类 HTML 文章的批量改写网页工具。支持导入多篇 HTML，调用 DeepSeek API 改写正文，并在导出时把图片标签按占位符位置还原回 HTML。

[English](README.en.md) · [返回首页](../README.md)

## 功能

- 拖拽或点击上传 `.html` / `.htm` 文件，支持批量导入
- 文件状态展示：待处理、进行中、完成、失败
- 原文预览和改写结果双 tab 查看
- 图片在预览和模型输入中显示为 `[IMAGE_N]` 占位符
- 可配置 DeepSeek API Key、模型、并发数、温度和 System Prompt
- 底部实时日志、token 用量和费用预估
- 一键导出全部完成结果为 zip

## 本地使用

直接用浏览器打开 `index.html` 即可。

## GitHub Pages 部署

仓库推送到 GitHub 后，可以在仓库的 `Settings -> Pages` 中选择 GitHub Actions 部署。本项目已包含 `.github/workflows/pages.yml`，推送到 `main` 分支后会自动发布静态页面。

## 注意

当前版本在浏览器端直接调用 DeepSeek API。公开部署时，请避免把 API Key 写进代码或提交到仓库；建议只在本机输入使用。后续如果要给多人使用，最好增加一个后端代理来保护 API Key 并规避浏览器 CORS 限制。

# Article Rewriting

一个面向公众号/教程类 HTML 文章的批量改写网页工具。支持导入多篇 HTML，通过安全代理调用 DeepSeek API 改写正文，并在导出时把图片标签按占位符位置还原回 HTML。

[English](README.en.md) · [返回首页](../README.md)

## 功能

- 拖拽或点击上传 `.html` / `.htm` 文件，支持批量导入
- 文件状态展示：待处理、进行中、完成、失败
- 原文预览和改写结果双 tab 查看
- 图片在预览和模型输入中显示为 `[IMAGE_N]` 占位符
- 可配置代理 API 地址、访问令牌、模型、并发数、温度和 System Prompt
- 底部实时日志、token 用量和费用预估
- 一键导出全部完成结果为 zip
- DeepSeek API Key 只保存在 Worker Secret 中，不暴露给浏览器

## 本地使用

直接用浏览器打开 `index.html` 即可。实际改写前，需要先部署 `worker/` 目录里的 Cloudflare Worker 代理。

## Cloudflare Worker 代理

进入 `worker/` 目录后部署 Worker：

```bash
npx wrangler deploy
```

设置服务端 Secret：

```bash
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put ACCESS_TOKEN
```

- `DEEPSEEK_API_KEY`：你的 DeepSeek API Key，只保存在 Cloudflare
- `ACCESS_TOKEN`：你自己设置的访问令牌，前端填写这个令牌来调用代理
- `ALLOWED_ORIGINS`：已在 `worker/wrangler.toml` 里默认允许 GitHub Pages 域名和本地调试地址

当前 Worker 地址：

```text
https://article-rewriting-api.xuelong528.workers.dev
```

部署完成后，把 Worker 地址填到前端的“代理 API 地址”，把 `ACCESS_TOKEN` 填到“访问令牌”。

## GitHub Pages 部署

仓库推送到 GitHub 后，可以在仓库的 `Settings -> Pages` 中选择 GitHub Actions 部署。本项目已包含 `.github/workflows/pages.yml`，推送到 `main` 分支后会自动发布静态页面。

## 注意

不要把 DeepSeek API Key 写进前端代码或提交到仓库。当前版本已经改为通过 Worker 代理调用 DeepSeek；公开使用时仍建议设置较强的 `ACCESS_TOKEN`，并根据需要调整输入长度、输出 token 和来源域名限制。

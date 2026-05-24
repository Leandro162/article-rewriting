# Article Rewriting

A browser-based batch rewriting tool for HTML articles. It imports multiple HTML files, rewrites article text with DeepSeek V4 through a secure proxy, keeps image placeholders during rewriting, and restores the original image tags when exporting HTML results.

[中文](README.zh-CN.md) · [Back to home](../README.md)

## Features

- Drag-and-drop or click-to-upload `.html` / `.htm` files
- Batch import with per-file status: pending, running, completed, failed
- Original preview and rewritten result tabs
- Image placeholders such as `[IMAGE_N]` during preview and model input
- Configurable proxy API URL, access token, model, concurrency, temperature, and System Prompt
- Supports `deepseek-v4-flash` and `deepseek-v4-pro`; Pro mode enables thinking in the proxy
- Live logs, token usage, and estimated cost
- Export all completed results as a zip package
- DeepSeek API Key stays in Worker secrets and is never exposed to the browser

## Local Usage

Open `index.html` directly in a browser. To run rewrites, deploy the Cloudflare Worker proxy in `worker/` first.

## Cloudflare Worker Proxy

Deploy the Worker from the `worker/` directory:

```bash
npx wrangler deploy
```

Set server-side secrets:

```bash
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put ACCESS_TOKEN
```

- `DEEPSEEK_API_KEY`: your DeepSeek API key, stored only in Cloudflare
- `ACCESS_TOKEN`: a private access token you enter in the frontend
- `ALLOWED_ORIGINS`: configured in `worker/wrangler.toml` for GitHub Pages and local testing
- `MAX_OUTPUT_TOKENS` / `THINKING_BUDGET_TOKENS`: output and thinking budget controls, both default to `4096`

Current Worker URL:

```text
https://article-rewriting-api.xuelong528.workers.dev
```

After deployment, enter the Worker URL as the frontend proxy API URL and use the same `ACCESS_TOKEN`.

## GitHub Pages Deployment

After pushing the repository to GitHub, open `Settings -> Pages` and choose GitHub Actions deployment. This project includes `.github/workflows/pages.yml`, so pushes to `main` can publish the static site automatically.

## Notes

Do not put DeepSeek API keys in frontend code or commit them to the repository. This version calls DeepSeek through the Worker proxy; for public usage, keep a strong `ACCESS_TOKEN` and adjust input, output, and origin limits as needed.

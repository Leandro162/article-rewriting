const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL_ALLOWLIST = new Set([
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "deepseek-chat",
  "deepseek-reasoner"
]);
const MODEL_ALIASES = {
  "deepseek-chat": "deepseek-v4-flash",
  "deepseek-reasoner": "deepseek-v4-pro"
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const corsHeaders = getCorsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/rewrite") {
      return json({ error: { message: "Not found" } }, 404, corsHeaders);
    }

    if (request.method !== "POST") {
      return json({ error: { message: "Method not allowed" } }, 405, corsHeaders);
    }

    if (!env.DEEPSEEK_API_KEY) {
      return json({ error: { message: "Server missing DEEPSEEK_API_KEY secret" } }, 500, corsHeaders);
    }

    if (!env.ACCESS_TOKEN) {
      return json({ error: { message: "Server missing ACCESS_TOKEN secret" } }, 500, corsHeaders);
    }

    const providedToken = request.headers.get("X-Access-Token") || "";
    if (providedToken !== env.ACCESS_TOKEN) {
      return json({ error: { message: "Invalid access token" } }, 401, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: { message: "Invalid JSON body" } }, 400, corsHeaders);
    }

    const validation = validatePayload(payload, env);
    if (validation) {
      return json({ error: { message: validation } }, 400, corsHeaders);
    }

    const model = normalizeModel(payload.model);
    const thinkingEnabled = model === "deepseek-v4-pro";
    const maxTokens = clampInt(env.MAX_OUTPUT_TOKENS, 1024, 8192, 4096);
    const temperature = clampNumber(payload.temperature, 0, 1, 0.7);

    const requestBody = {
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: payload.systemPrompt },
        { role: "user", content: `请改写以下文章内容，保留所有 [IMAGE_N] 占位符不变：\n\n${payload.text}` }
      ]
    };

    if (thinkingEnabled) {
      requestBody.thinking = {
        type: "enabled",
        budget_tokens: clampInt(env.THINKING_BUDGET_TOKENS, 1024, 8192, 4096)
      };
    } else {
      requestBody.temperature = temperature;
      requestBody.thinking = { type: "disabled" };
    }

    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return json({
        error: {
          message: data.error?.message || `DeepSeek request failed: HTTP ${upstream.status}`
        }
      }, upstream.status, corsHeaders);
    }

    return json({
      content: data.choices?.[0]?.message?.content || "",
      usage: data.usage || {},
      model,
      thinking: thinkingEnabled
    }, 200, corsHeaders);
  }
};

function validatePayload(payload, env) {
  if (!payload || typeof payload !== "object") return "Request body must be an object";
  if (!MODEL_ALLOWLIST.has(payload.model)) return "Unsupported model";
  if (typeof payload.systemPrompt !== "string" || payload.systemPrompt.trim().length < 1) {
    return "System prompt is required";
  }
  if (typeof payload.text !== "string" || payload.text.trim().length < 1) {
    return "Article text is required";
  }
  const maxInputChars = clampInt(env.MAX_INPUT_CHARS, 1000, 200000, 60000);
  if (payload.text.length > maxInputChars) {
    return `Article text is too long. Max ${maxInputChars} characters`;
  }
  return "";
}

function normalizeModel(model) {
  return MODEL_ALIASES[model] || model;
}

function getCorsHeaders(origin, env) {
  const allowedOrigins = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Access-Token",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function clampInt(value, min, max, fallback) {
  const number = parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

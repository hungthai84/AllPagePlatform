import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to normalize and validate URL
function normalizeUrl(inputUrl: string): string {
  let url = inputUrl.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  try {
    new URL(url);
    return url;
  } catch (e) {
    return "";
  }
}

// Check if a URL allows iframe embedding
async function checkEmbedStatus(targetUrl: string) {
  const url = normalizeUrl(targetUrl);
  if (!url) {
    return {
      url: targetUrl,
      embeddable: false,
      error: "Địa chỉ URL không hợp lệ.",
      xFrameOptions: null,
      cspFrameAncestors: null,
      status: 400
    };
  }

  try {
    // Try to check with a HEAD request first (efficient)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (e) {
      // Fallback to GET if HEAD is not allowed/supported
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 5000);
      response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        signal: fallbackController.signal
      });
      clearTimeout(fallbackTimeout);
    }

    const xFrameOptions = response.headers.get("x-frame-options") || response.headers.get("X-Frame-Options");
    const csp = response.headers.get("content-security-policy") || response.headers.get("Content-Security-Policy");

    let embeddable = true;
    let reasonXFrame = null;
    let reasonCsp = null;

    if (xFrameOptions) {
      const xfo = xFrameOptions.toLowerCase();
      if (xfo.includes("deny") || xfo.includes("sameorigin") || xfo.includes("allow-from")) {
        embeddable = false;
        reasonXFrame = xFrameOptions;
      }
    }

    if (csp) {
      const cspLower = csp.toLowerCase();
      if (cspLower.includes("frame-ancestors")) {
        // frame-ancestors 'none' or 'self' or specific domains
        // Unless it includes '*', it's usually restricted
        if (!cspLower.includes("frame-ancestors *")) {
          embeddable = false;
          reasonCsp = csp;
        }
      }
    }

    // Certain known sites that are known to block embedding even if HEAD doesn't reveal it (or for safety)
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const knownBlocks = ["google.com", "google.com.vn", "youtube.com", "facebook.com", "github.com", "twitter.com", "x.com", "linkedin.com", "instagram.com"];
    if (knownBlocks.some(kb => domain === kb || domain.endsWith("." + kb))) {
      embeddable = false;
      if (!reasonXFrame) reasonXFrame = "SAMEORIGIN (Known Restriction)";
    }

    return {
      url,
      embeddable,
      xFrameOptions: reasonXFrame,
      cspFrameAncestors: reasonCsp,
      status: response.status
    };
  } catch (error) {
    console.error("Error checking embed status for URL:", url, error);
    // If it fails to fetch (e.g. CORS block, offline, DNS issues), we assume not embeddable or unknown
    return {
      url,
      embeddable: false,
      error: error instanceof Error ? error.message : String(error),
      xFrameOptions: "FETCH_FAILED",
      cspFrameAncestors: null,
      status: 500
    };
  }
}

// Scrape basic HTML metadata (title, meta descriptions, etc.)
async function scrapeMetadata(targetUrl: string) {
  const url = normalizeUrl(targetUrl);
  if (!url) return { title: "", description: "", htmlSample: "" };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    // We only read a small portion of the response to be fast
    const reader = response.body?.getReader();
    if (!reader) {
      const text = await response.text();
      return parseHtmlMeta(text.substring(0, 100000));
    }

    let chunks = [];
    let receivedLength = 0;
    const decoder = new TextDecoder();

    while (receivedLength < 100000) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
    }

    // Combine chunks
    const combined = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
      combined.set(chunk, position);
      position += chunk.length;
    }

    const html = decoder.decode(combined);
    return parseHtmlMeta(html);
  } catch (error) {
    console.error("Metadata scrape error:", error);
    return { title: "", description: "", htmlSample: "" };
  }
}

// Basic regex parser for metadata
function parseHtmlMeta(html: string) {
  let title = "";
  let description = "";

  // Title tags
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Og:title tags
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                     html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (ogTitleMatch) {
    title = ogTitleMatch[1].trim();
  }

  // Description meta tag
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (descMatch) {
    description = descMatch[1].trim();
  }

  // Og:description tags
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  if (ogDescMatch) {
    description = ogDescMatch[1].trim();
  }

  // Decode HTML entities briefly if present
  const decode = (str: string) => str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  return {
    title: decode(title),
    description: decode(description),
    htmlSample: html.substring(0, 2000) // snippet for Gemini
  };
}

// API: Check if URL can be embedded
app.get("/api/check-embed", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: "Tham số 'url' là bắt buộc." });
  }

  const result = await checkEmbedStatus(targetUrl);
  res.json(result);
});

// API: Analyze URL with Gemini + scraper
app.post("/api/analyze-url", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Địa chỉ 'url' là bắt buộc." });
  }

  const normalized = normalizeUrl(url);
  if (!normalized) {
    return res.status(400).json({ error: "Địa chỉ URL không hợp lệ." });
  }

  // Step 1: Check embed header status
  const embedResult = await checkEmbedStatus(normalized);

  // Step 2: Scrape basic page meta
  const scraped = await scrapeMetadata(normalized);

  const ai = getGeminiClient();
  if (!ai) {
    // If Gemini key is missing, return scraped metadata with default icon and category
    return res.json({
      title: scraped.title || new URL(normalized).hostname,
      description: scraped.description || "Không có mô tả.",
      category: "Chung",
      icon: "Globe",
      embeddable: embedResult.embeddable
    });
  }

  try {
    const prompt = `Bạn là một trợ lý phân tích trang web chuyên nghiệp. Hãy phân tích thông tin trang web dưới đây:
URL: ${normalized}
Tiêu đề cào được: ${scraped.title}
Mô tả cào được: ${scraped.description}
Một phần HTML:
${scraped.htmlSample}

Hãy tạo ra một đối tượng cấu hình menu dạng JSON cho trang web này.
Yêu cầu:
1. "title": Tên hiển thị ngắn gọn, trực quan, chuyên nghiệp của trang web (tối đa 25 ký tự, ví dụ: "Wikipedia Tiếng Việt", "Bản đồ OpenStreetMap").
2. "description": Mô tả ngắn gọn về nội dung trang web (bằng tiếng Việt, tối đa 80 ký tự).
3. "category": Nhóm danh mục phù hợp nhất cho trang web (tiếng Việt, ví dụ: "Học tập", "Công cụ", "Tin tức", "Bản đồ", "Giải trí", "Lập trình").
4. "icon": Chọn một tên biểu tượng thích hợp nhất từ danh sách Lucide Icons sau đây: "Globe", "BookOpen", "Search", "Map", "Compass", "Code", "Video", "Music", "Briefcase", "Terminal", "Settings", "Info", "Cloud", "Image", "Heart", "ExternalLink".
5. "embeddable": Xác nhận khả năng nhúng. Chúng tôi đã kiểm tra kỹ thuật và kết quả là: ${embedResult.embeddable}. Hãy trả về đúng giá trị boolean này.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Display name of the website, max 25 chars" },
            description: { type: Type.STRING, description: "Short Vietnamese description, max 80 chars" },
            category: { type: Type.STRING, description: "Category name in Vietnamese" },
            icon: { type: Type.STRING, description: "A Lucide icon name from the specified list" },
            embeddable: { type: Type.BOOLEAN, description: "Value reflecting embed technical check" }
          },
          required: ["title", "description", "category", "icon", "embeddable"]
        }
      }
    });

    const aiResult = JSON.parse(response.text.trim());
    res.json(aiResult);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    // Safe fallback if Gemini fails
    res.json({
      title: scraped.title || new URL(normalized).hostname,
      description: scraped.description || "Không thể phân tích mô tả chuyên sâu.",
      category: "Tiện ích",
      icon: "Globe",
      embeddable: embedResult.embeddable
    });
  }
});

// Setup development or production environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted (Development Mode)");
  } else {
    // Production Mode - serve static built assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static file serving mounted (Production Mode)");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

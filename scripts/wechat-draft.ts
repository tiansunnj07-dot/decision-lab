/**
 * 微信公众号草稿生成脚本
 *
 * 用法：npx tsx scripts/wechat-draft.ts <slug>
 * 示例：npx tsx scripts/wechat-draft.ts taming-the-data-future
 *
 * 功能：
 * 1. 读取 src/content/blog/{slug}.mdx 文件
 * 2. 上传 public/blog/{slug}/images/ 下的所有图片到微信服务器
 * 3. 将 Markdown 转为微信兼容的内联样式 HTML
 * 4. 在文末追加主页导流链接
 * 5. 调用微信草稿箱 API 创建图文草稿
 */

import fs from "fs";
import path from "path";
import https from "https";
import { Marked } from "marked";
import matter from "gray-matter";
import { WECHAT_CONFIG } from "./wechat-config";

/* ========== 常量 ========== */

const BASE_URL = "https://api.weixin.qq.com";
const SITE_URL = "https://sweetdatalove.online";
const PROJECT_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(PROJECT_ROOT, "src/content/blog");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

/* ========== 工具函数 ========== */

/** 用 https 模块上传文件（multipart/form-data），避免 fetch + form-data 兼容性问题 */
function uploadFile(url: string, filePath: string, fieldName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const boundary = "----WeChatUpload" + Date.now();

    // 构建 multipart body
    const header = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"\r\n` +
      `Content-Type: image/png\r\n\r\n`
    );
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, fileBuffer, footer]);

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`无法解析响应: ${data}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/* ========== 微信 API 封装 ========== */

/** 获取 access_token */
async function getAccessToken(): Promise<string> {
  const url = `${BASE_URL}/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}`;
  const res = await fetch(url);
  const data = await res.json() as any;

  if (data.errcode) {
    throw new Error(`获取 access_token 失败: ${data.errcode} - ${data.errmsg}`);
  }
  console.log("✅ access_token 获取成功");
  return data.access_token;
}

/** 上传文章内图片（返回微信 URL，用于正文中的 <img> 标签） */
async function uploadArticleImage(token: string, filePath: string): Promise<string> {
  const url = `${BASE_URL}/cgi-bin/media/uploadimg?access_token=${token}`;
  const data = await uploadFile(url, filePath, "media");

  if (data.errcode) {
    throw new Error(`上传图片失败 (${path.basename(filePath)}): ${data.errcode} - ${data.errmsg}`);
  }
  console.log(`  📷 已上传: ${path.basename(filePath)}`);
  return data.url;
}

/** 上传封面图（永久素材，返回 media_id） */
async function uploadThumbImage(token: string, filePath: string): Promise<string> {
  const url = `${BASE_URL}/cgi-bin/material/add_material?access_token=${token}&type=image`;
  const data = await uploadFile(url, filePath, "media");

  if (data.errcode) {
    throw new Error(`上传封面图失败: ${data.errcode} - ${data.errmsg}`);
  }
  console.log("✅ 封面图上传成功");
  return data.media_id;
}

/** 创建草稿 */
async function createDraft(
  token: string,
  article: {
    title: string;
    content: string;
    digest: string;
    thumbMediaId: string;
    sourceUrl: string;
    author: string;
  }
): Promise<string> {
  const url = `${BASE_URL}/cgi-bin/draft/add?access_token=${token}`;
  const body = {
    articles: [
      {
        title: article.title,
        author: article.author,
        digest: article.digest,
        content: article.content,
        content_source_url: article.sourceUrl,
        thumb_media_id: article.thumbMediaId,
        need_open_comment: 1,
        only_fans_can_comment: 0,
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as any;

  if (data.errcode) {
    throw new Error(`创建草稿失败: ${data.errcode} - ${data.errmsg}`);
  }
  return data.media_id;
}

/* ========== Markdown → 微信 HTML ========== */

/** 微信兼容的内联样式映射 */
const STYLES = {
  h1: 'style="margin: 2em 0 1em; font-size: 22px; font-weight: bold; color: #1a1a1a; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;"',
  h2: 'style="margin: 1.5em 0 0.8em; font-size: 19px; font-weight: bold; color: #1a1a1a; border-left: 4px solid #06b6d4; padding-left: 10px;"',
  h3: 'style="margin: 1.2em 0 0.6em; font-size: 17px; font-weight: bold; color: #333;"',
  p: 'style="margin: 1em 0; font-size: 15px; line-height: 1.8; color: #333;"',
  img: 'style="max-width: 100%; border-radius: 8px; margin: 1em 0; display: block;"',
  blockquote: 'style="margin: 1em 0; padding: 12px 16px; border-left: 4px solid #06b6d4; background: #f0fdfa; color: #555; font-size: 14px; line-height: 1.6;"',
  ul: 'style="margin: 1em 0; padding-left: 2em; font-size: 15px; line-height: 1.8; color: #333;"',
  ol: 'style="margin: 1em 0; padding-left: 2em; font-size: 15px; line-height: 1.8; color: #333;"',
  li: 'style="margin: 0.3em 0; line-height: 1.8;"',
  strong: 'style="color: #0e7490; font-weight: bold;"',
  hr: 'style="border: none; border-top: 1px solid #e2e8f0; margin: 2em 0;"',
  code: 'style="background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-family: Menlo, monospace; font-size: 13px; color: #0e7490;"',
};

/** 将 Markdown 转为微信兼容 HTML（内联样式） */
function markdownToWechatHtml(markdown: string, imageMap: Map<string, string>): string {
  const marked = new Marked();

  marked.use({
    renderer: {
      heading({ tokens, depth }): string {
        const text = this.parser.parseInline(tokens);
        const tag = `h${depth}` as keyof typeof STYLES;
        const style = STYLES[tag] || STYLES.h3;
        return `<h${depth} ${style}>${text}</h${depth}>`;
      },
      paragraph({ tokens }): string {
        const text = this.parser.parseInline(tokens);
        if (text.trim().startsWith("<img ")) {
          return text;
        }
        return `<p ${STYLES.p}>${text}</p>`;
      },
      image({ href, text }): string {
        const wxUrl = imageMap.get(href) || href;
        return `<img src="${wxUrl}" alt="${text || ""}" ${STYLES.img} />`;
      },
      blockquote({ tokens }): string {
        const body = this.parser.parse(tokens);
        return `<blockquote ${STYLES.blockquote}>${body}</blockquote>`;
      },
      list({ ordered, items }): string {
        const tag = ordered ? "ol" : "ul";
        const style = ordered ? STYLES.ol : STYLES.ul;
        const itemsHtml = items
          .map((item) => {
            const text = this.parser.parse(item.tokens);
            return `<li ${STYLES.li}>${text}</li>`;
          })
          .join("");
        return `<${tag} ${style}>${itemsHtml}</${tag}>`;
      },
      strong({ tokens }): string {
        const text = this.parser.parseInline(tokens);
        return `<strong ${STYLES.strong}>${text}</strong>`;
      },
      codespan({ text }): string {
        return `<code ${STYLES.code}>${text}</code>`;
      },
      hr(): string {
        return `<hr ${STYLES.hr} />`;
      },
    },
  });

  return marked.parse(markdown) as string;
}

/** 生成文末导流区域 HTML */
function getFooterHtml(slug: string): string {
  const articleUrl = `${SITE_URL}/blog/${slug}`;
  return `
<section style="margin-top: 2.5em; padding: 20px; background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%); border-radius: 10px; border: 1px solid #cffafe;">
  <p style="font-size: 15px; font-weight: bold; color: #0e7490; margin: 0 0 8px;">📖 在网站上阅读完整版（更好的排版体验）</p>
  <p style="font-size: 14px; color: #555; margin: 0 0 12px;">
    <a href="${articleUrl}" style="color: #0891b2; text-decoration: underline;">${articleUrl}</a>
  </p>
  <hr style="border: none; border-top: 1px solid #cffafe; margin: 12px 0;" />
  <p style="font-size: 15px; font-weight: bold; color: #0e7490; margin: 0 0 8px;">🏠 访问甜博士主页，探索更多内容</p>
  <p style="font-size: 14px; color: #555; margin: 0;">
    <a href="${SITE_URL}" style="color: #0891b2; text-decoration: underline;">${SITE_URL}</a>
  </p>
</section>
<p style="text-align: center; font-size: 13px; color: #94a3b8; margin-top: 1.5em;">
  — Dr. Sweet · 科学决策 · 数据思维 · 深度探索 —
</p>`;
}

/* ========== 主流程 ========== */

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("❌ 用法: npx tsx scripts/wechat-draft.ts <slug>");
    console.error("   示例: npx tsx scripts/wechat-draft.ts taming-the-data-future");
    process.exit(1);
  }

  console.log(`\n🚀 开始为文章 [${slug}] 生成微信草稿...\n`);

  // 1. 读取 MDX 文件
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    console.error(`❌ 找不到文章: ${mdxPath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(mdxPath, "utf-8");
  const { data: frontmatter, content: mdContent } = matter(raw);
  console.log(`📄 文章标题: ${frontmatter.title}`);

  // 2. 获取 access_token
  const token = await getAccessToken();

  // 3. 上传图片到微信服务器，建立路径映射
  const imagesDir = path.join(PUBLIC_DIR, "blog", slug, "images");
  const imageMap = new Map<string, string>();

  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter((f) =>
      /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
    );
    console.log(`\n📷 上传 ${imageFiles.length} 张图片到微信...`);

    for (const file of imageFiles) {
      const localPath = path.join(imagesDir, file);
      const wxUrl = await uploadArticleImage(token, localPath);
      imageMap.set(`/blog/${slug}/images/${file}`, wxUrl);
    }
    console.log("");
  }

  // 4. 将 Markdown 转为微信兼容 HTML
  console.log("📝 转换 HTML...");
  let htmlContent = markdownToWechatHtml(mdContent, imageMap);

  // 5. 追加文末导流链接
  htmlContent += getFooterHtml(slug);
  console.log("✅ HTML 转换完成（已追加主页导流链接）");

  // 6. 上传封面图
  let thumbMediaId = "";
  if (fs.existsSync(imagesDir)) {
    const firstImage = fs.readdirSync(imagesDir).filter((f) =>
      /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
    )[0];
    if (firstImage) {
      console.log("\n🖼️  上传封面图...");
      thumbMediaId = await uploadThumbImage(token, path.join(imagesDir, firstImage));
    }
  }

  // 7. 创建草稿
  console.log("\n📮 创建微信草稿...");
  const draftMediaId = await createDraft(token, {
    title: frontmatter.title,
    content: htmlContent,
    digest: frontmatter.description || "",
    thumbMediaId,
    sourceUrl: `${SITE_URL}/blog/${slug}`,
    author: "甜博士",
  });

  console.log(`\n🎉 草稿创建成功！`);
  console.log(`   media_id: ${draftMediaId}`);
  console.log(`   请前往微信公众平台后台 → 草稿箱 查看和发布\n`);
}

main().catch((err) => {
  console.error("\n❌ 脚本执行失败:", err.message || err);
  process.exit(1);
});

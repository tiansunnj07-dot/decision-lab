// lib/lab/generateShareCard.ts
// 截取网页版报告 + 附加二维码导流 footer，下载为图片
// 使用 html-to-image（基于 foreignObject，支持所有现代 CSS 包括 lab() 颜色）

import { toPng } from "html-to-image";
import QRCode from "qrcode";
import type { Persona } from "./decisionEngine";
import { PERSONA_INFO } from "./personaMetadata";

/**
 * 截取网页版报告并附加二维码导流 footer，下载为 PNG 图片
 */
export async function downloadShareCard(
  reportElement: HTMLElement,
  top1: Persona
): Promise<void> {
  const top1Info = PERSONA_INFO[top1];

  // ── 1. 临时切换亮色模式 ──
  const htmlEl = document.documentElement;
  const wasDark = htmlEl.classList.contains("dark");
  if (wasDark) {
    htmlEl.classList.remove("dark");
    void reportElement.offsetHeight;
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  }

  let reportDataUrl: string;
  try {
    // ── 2. 用 html-to-image 截取报告内容 ──
    reportDataUrl = await toPng(reportElement, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      cacheBust: true,
    });
  } catch (err) {
    if (wasDark) htmlEl.classList.add("dark");
    console.error("[ShareCard] html-to-image failed:", err);
    throw new Error(
      "截图渲染失败: " +
        (err instanceof Error ? err.message : String(err))
    );
  }

  // ── 3. 恢复暗色模式 ──
  if (wasDark) {
    htmlEl.classList.add("dark");
  }

  // ── 4. 加载截图为 Image ──
  const reportImg = await loadImage(reportDataUrl);

  // ── 5. 生成 QR Code ──
  const qrUrl = "https://sweetdatalove.online/lab/executive-judgment";
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 240,
    margin: 2,
    color: { dark: "#1e293b", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
  const qrImg = await loadImage(qrDataUrl);

  // ── 6. 合成最终图片：报告截图 + 导流 footer ──
  const footerH = 260; // footer 高度 (px)
  const dividerH = 2;

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = reportImg.width;
  finalCanvas.height = reportImg.height + dividerH + footerH;
  const ctx = finalCanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 创建失败");

  // 缩放因子（html-to-image pixelRatio=2）
  const s = reportImg.width / reportElement.offsetWidth;

  // 白色背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // 绘制报告截图
  ctx.drawImage(reportImg, 0, 0);

  // 分隔线
  const lineY = reportImg.height;
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(30 * s, lineY, finalCanvas.width - 60 * s, dividerH);

  // Footer 起始 Y
  const fy = lineY + dividerH + 20 * s;

  // QR Code（右侧）
  const qrSize = 80 * s;
  const qrX = finalCanvas.width - 30 * s - qrSize;
  const qrY = fy;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // "扫码体验"
  ctx.fillStyle = "#94a3b8";
  ctx.font = `${11 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("扫码体验", qrX + qrSize / 2, qrY + qrSize + 16 * s);

  // 左侧文案
  ctx.textAlign = "left";
  ctx.fillStyle = "#1e293b";
  ctx.font = `bold ${16 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.fillText("甜博士 · 决策实验室", 30 * s, fy + 18 * s);

  ctx.fillStyle = "#64748b";
  ctx.font = `${13 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.fillText("6-8 分钟 · 纯客户端 · 不存储数据", 30 * s, fy + 42 * s);

  ctx.fillStyle = "#7c3aed";
  ctx.font = `500 ${14 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.fillText("sweetdatalove.online", 30 * s, fy + 66 * s);

  // ── 7. 触发下载 ──
  const dataUrl = finalCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `决策人格报告-${top1Info.name}.png`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 300);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = src;
  });
}

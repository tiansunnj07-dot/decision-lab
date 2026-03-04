// lib/lab/generateShareCard.ts
// 截取网页版报告 + 附加二维码导流 footer，下载为图片

import QRCode from "qrcode";
import type { Persona } from "./decisionEngine";
import { PERSONA_INFO } from "./personaMetadata";

/**
 * 截取网页版报告并附加二维码导流 footer，下载为 PNG 图片
 * @param reportElement 需要截取的报告内容 DOM 元素
 * @param top1 主导人格类型
 */
export async function downloadShareCard(
  reportElement: HTMLElement,
  top1: Persona
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const top1Info = PERSONA_INFO[top1];

  // ── 临时切换为亮色模式以确保截图清晰 ──
  const htmlEl = document.documentElement;
  const wasDark = htmlEl.classList.contains("dark");
  if (wasDark) {
    htmlEl.classList.remove("dark");
    // 强制 reflow 让样式生效
    void reportElement.offsetHeight;
    // 等待一帧让浏览器完成渲染
    await new Promise((r) => requestAnimationFrame(r));
  }

  // ── 截取网页报告 ──
  const reportCanvas = await html2canvas(reportElement, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  // ── 恢复暗色模式 ──
  if (wasDark) {
    htmlEl.classList.add("dark");
  }

  // ── 生成 QR Code ──
  const qrUrl = "https://sweetdatalove.online/lab/executive-judgment";
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 240,
    margin: 2,
    color: { dark: "#1e293b", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
  const qrImg = await loadImage(qrDataUrl);

  // ── 合成最终图片：报告截图 + 导流 footer ──
  const s = 2; // 与 html2canvas scale 匹配
  const footerH = 130 * s;
  const dividerH = 1 * s;

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = reportCanvas.width;
  finalCanvas.height = reportCanvas.height + dividerH + footerH;
  const ctx = finalCanvas.getContext("2d")!;

  // 白色背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // 绘制报告截图
  ctx.drawImage(reportCanvas, 0, 0);

  // 分隔线
  const lineY = reportCanvas.height;
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(40 * s, lineY, finalCanvas.width - 80 * s, dividerH);

  // Footer 起始 Y
  const fy = lineY + dividerH + 24 * s;

  // QR Code（右侧）
  const qrSize = 80 * s;
  const qrX = finalCanvas.width - 40 * s - qrSize;
  const qrY = fy;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // "扫码体验" 提示
  ctx.fillStyle = "#94a3b8";
  ctx.font = `${11 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("扫码体验", qrX + qrSize / 2, qrY + qrSize + 18 * s);

  // 左侧文案
  ctx.textAlign = "left";
  ctx.fillStyle = "#1e293b";
  ctx.font = `bold ${16 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.fillText("甜博士 · 决策实验室", 40 * s, fy + 18 * s);

  ctx.fillStyle = "#64748b";
  ctx.font = `${13 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.fillText("6-8 分钟 · 纯客户端 · 不存储数据", 40 * s, fy + 44 * s);

  ctx.fillStyle = "#7c3aed";
  ctx.font = `500 ${14 * s}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
  ctx.fillText("sweetdatalove.online", 40 * s, fy + 70 * s);

  // ── 导出下载 ──
  finalCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `决策人格报告-${top1Info.name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

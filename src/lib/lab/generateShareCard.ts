// lib/lab/generateShareCard.ts
// 生成分享卡片图片（Canvas 2D API + QR Code）

import QRCode from "qrcode";
import type { Persona } from "./decisionEngine";
import { PERSONA_INFO } from "./personaMetadata";

interface ShareCardData {
  top1: Persona;
  top2: Persona;
  confidence: number;
  personaDist: Record<Persona, number>;
  evidence: string[];
  jd5WeakNames: string[];
}

const PERSONA_COLORS: Record<Persona, string> = {
  E: "#7c3aed", // violet
  A: "#2563eb", // blue
  D: "#059669", // emerald
  I: "#d97706", // amber
  O: "#e11d48", // rose
};

const CARD_W = 750;
const CARD_H = 1334;
const PERSONAS_ORDER: Persona[] = ["E", "A", "D", "I", "O"];

/**
 * 生成分享卡片并触发下载
 */
export async function downloadShareCard(data: ShareCardData): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;

  // ── 背景渐变 ──────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, "#0f0a1e");
  bg.addColorStop(0.4, "#1a1035");
  bg.addColorStop(1, "#0d0820");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // 装饰光斑
  drawGlow(ctx, 150, 200, 250, "rgba(124, 58, 237, 0.08)");
  drawGlow(ctx, 600, 900, 300, "rgba(59, 130, 246, 0.06)");

  const top1Info = PERSONA_INFO[data.top1];
  const top2Info = PERSONA_INFO[data.top2];
  const color = PERSONA_COLORS[data.top1];
  const confPct = Math.round(data.confidence * 100);

  let y = 60;

  // ── 顶部 Logo ──────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "500 16px -apple-system, 'SF Pro Display', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("甜博士 · 决策实验室", CARD_W / 2, y);
  y += 14;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.fillText("Dr. Sweet Decision Lab", CARD_W / 2, y);

  // ── 主人格揭示 ──────────────────────────
  y += 55;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "500 14px -apple-system, sans-serif";
  ctx.fillText("我的决策人格", CARD_W / 2, y);

  y += 52;
  ctx.fillStyle = color;
  ctx.font = "bold 52px -apple-system, 'SF Pro Display', sans-serif";
  ctx.fillText(`「${top1Info.name}」`, CARD_W / 2, y);

  y += 28;
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "16px -apple-system, sans-serif";
  ctx.fillText(top1Info.subtitle, CARD_W / 2, y);

  // ── 标签行 ──────────────────────────
  y += 40;
  // 主导标签
  const tag1 = `主导：${top1Info.name}`;
  const tag2 = `次级：${top2Info.name}`;
  const tag1W = ctx.measureText(tag1).width + 24;
  const tag2W = ctx.measureText(tag2).width + 24;
  const totalTagW = tag1W + 12 + tag2W;
  let tagX = (CARD_W - totalTagW) / 2;

  roundRect(ctx, tagX, y - 14, tag1W, 28, 14, color);
  ctx.fillStyle = "#fff";
  ctx.font = "500 13px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tag1, tagX + tag1W / 2, y + 4);

  tagX += tag1W + 12;
  roundRect(ctx, tagX, y - 14, tag2W, 28, 14, "rgba(255,255,255,0.12)");
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(tag2, tagX + tag2W / 2, y + 4);

  // ── 置信度 ──────────────────────────
  y += 30;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.textAlign = "center";
  if (data.confidence < 0.1) {
    ctx.fillText(
      `你在「${top1Info.name}」和「${top2Info.name}」之间频繁切换`,
      CARD_W / 2, y
    );
  } else {
    ctx.fillText(`置信度 ${confPct}%  ·  主导模式较为清晰`, CARD_W / 2, y);
  }

  // ── 雷达图 ──────────────────────────
  y += 50;
  drawRadar(ctx, CARD_W / 2, y + 100, 95, data.personaDist, color);
  y += 220;

  // ── 描述 ──────────────────────────
  y += 10;
  ctx.textAlign = "left";
  const descLines = wrapText(ctx, top1Info.description, 620, "15px -apple-system, sans-serif");
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "15px -apple-system, sans-serif";
  for (const line of descLines) {
    ctx.fillText(line, 65, y);
    y += 24;
  }

  // ── 行为证据 ──────────────────────────
  y += 16;
  // 分隔线
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(65, y);
  ctx.lineTo(CARD_W - 65, y);
  ctx.stroke();
  y += 24;

  ctx.fillStyle = color;
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.fillText("📊 行为证据", 65, y);
  y += 20;

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "13px -apple-system, sans-serif";
  for (const ev of data.evidence.slice(0, 2)) {
    const lines = wrapText(ctx, `· ${ev}`, 600, "13px -apple-system, sans-serif");
    for (const line of lines) {
      ctx.fillText(line, 75, y);
      y += 20;
    }
    y += 4;
  }

  // ── JD5 弱项 ──────────────────────────
  if (data.jd5WeakNames.length > 0) {
    y += 8;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(65, y);
    ctx.lineTo(CARD_W - 65, y);
    ctx.stroke();
    y += 24;

    ctx.fillStyle = color;
    ctx.font = "bold 14px -apple-system, sans-serif";
    ctx.fillText("⚠️ 判断力盲区", 65, y);
    y += 20;

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "13px -apple-system, sans-serif";
    ctx.fillText(`易忽略步骤：${data.jd5WeakNames.join("、")}`, 75, y);
    y += 24;
  }

  // ── 底部区域：QR Code + URL ──────────────────────────
  // 分隔线
  const bottomY = CARD_H - 200;
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(65, bottomY);
  ctx.lineTo(CARD_W - 65, bottomY);
  ctx.stroke();

  // QR Code
  const qrUrl = "https://sweetdatalove.online/lab/executive-judgment";
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 120,
    margin: 1,
    color: { dark: "#ffffffcc", light: "#00000000" },
    errorCorrectionLevel: "M",
  });
  const qrImg = await loadImage(qrDataUrl);
  const qrSize = 110;
  const qrX = CARD_W - 65 - qrSize;
  const qrY = bottomY + 24;

  // QR 背景
  roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12, "rgba(255,255,255,0.06)");
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // QR 说明
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("扫码验证你的判断力", qrX + qrSize / 2, qrY + qrSize + 24);

  // 左侧文案
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "500 15px -apple-system, sans-serif";
  ctx.fillText("你也来测试一下？", 65, qrY + 20);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.fillText("6-8 分钟 · 纯客户端 · 不存储数据", 65, qrY + 44);

  ctx.fillStyle = color;
  ctx.font = "500 13px -apple-system, sans-serif";
  ctx.fillText("sweetdatalove.online", 65, qrY + 70);

  // 最底部 footer
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "甜博士决策实验室 · sweetdatalove.online · 结果仅供参考",
    CARD_W / 2,
    CARD_H - 24
  );

  // ── 导出下载 ──────────────────────────
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `决策人格-${top1Info.name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

/* ── 辅助函数 ──────────────────────────── */

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawRadar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  dist: Record<Persona, number>,
  accentColor: string
) {
  const n = PERSONAS_ORDER.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  function getPoint(i: number, val: number) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + radius * val * Math.cos(angle), y: cy + radius * val * Math.sin(angle) };
  }

  // 网格
  for (const lvl of levels) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, lvl);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 轴线
  for (let i = 0; i < n; i++) {
    const p = getPoint(i, 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 数据多边形
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const val = 0.1 + (dist[PERSONAS_ORDER[i]] ?? 0) * 0.9;
    const p = getPoint(i, Math.min(val, 1));
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = accentColor + "30";
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 数据点
  for (let i = 0; i < n; i++) {
    const val = 0.1 + (dist[PERSONAS_ORDER[i]] ?? 0) * 0.9;
    const p = getPoint(i, Math.min(val, 1));
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
  }

  // 标签
  const labelNames = PERSONAS_ORDER.map((p) => PERSONA_INFO[p].name);
  ctx.font = "500 12px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 0; i < n; i++) {
    const p = getPoint(i, 1.28);
    ctx.fillText(labelNames[i], p.x, p.y + 4);
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string
): string[] {
  ctx.font = font;
  const chars = text.split("");
  const lines: string[] = [];
  let line = "";

  for (const ch of chars) {
    const testLine = line + ch;
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = ch;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

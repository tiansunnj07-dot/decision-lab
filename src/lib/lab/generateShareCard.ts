// lib/lab/generateShareCard.ts
// 生成完整决策报告卡片（Canvas 2D API + QR Code）
// 包含所有报告模块：人格揭示、优势与风险、行为证据、JD5盲区、风险路径回放、升级路径

import QRCode from "qrcode";
import type { Persona } from "./decisionEngine";
import { PERSONA_INFO } from "./personaMetadata";

interface TrapOutcomeData {
  timeline: { t: string; text: string }[];
  stateDelta: { H: number; S: number; R: number; V: number };
}

interface ShareCardData {
  top1: Persona;
  top2: Persona;
  confidence: number;
  personaDist: Record<Persona, number>;
  evidence: string[];
  jd5Weak: { name: string; description: string; question: string }[];
  strengths: string[];
  risks: string[];
  trapTitle?: string;
  trapOutcome?: TrapOutcomeData;
  upgradeTips: string[];
}

const PERSONA_COLORS: Record<Persona, string> = {
  E: "#7c3aed",
  A: "#2563eb",
  D: "#059669",
  I: "#d97706",
  O: "#e11d48",
};

const PERSONAS_ORDER: Persona[] = ["E", "A", "D", "I", "O"];
const CARD_W = 750;
const MARGIN = 65;
const CONTENT_W = CARD_W - MARGIN * 2;

/**
 * 生成完整决策报告卡片并触发下载
 */
export async function downloadShareCard(data: ShareCardData): Promise<void> {
  const top1Info = PERSONA_INFO[data.top1];
  const top2Info = PERSONA_INFO[data.top2];
  const color = PERSONA_COLORS[data.top1];
  const confPct = Math.round(data.confidence * 100);

  // ── 第一遍：计算内容高度 ──────────────────────────
  const measureCanvas = document.createElement("canvas");
  measureCanvas.width = CARD_W;
  measureCanvas.height = 100;
  const mCtx = measureCanvas.getContext("2d")!;

  const totalHeight = calculateTotalHeight(mCtx, data, top1Info, color);

  // ── 第二遍：实际绘制 ──────────────────────────
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  // ── 背景渐变 ──────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, totalHeight);
  bg.addColorStop(0, "#0f0a1e");
  bg.addColorStop(0.3, "#1a1035");
  bg.addColorStop(0.7, "#130d28");
  bg.addColorStop(1, "#0d0820");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, totalHeight);

  // 装饰光斑
  drawGlow(ctx, 150, 200, 250, "rgba(124, 58, 237, 0.08)");
  drawGlow(ctx, 600, 900, 300, "rgba(59, 130, 246, 0.06)");
  drawGlow(ctx, 200, totalHeight * 0.6, 280, "rgba(16, 185, 129, 0.04)");

  let y = 60;

  // ═══════════════════════════════════════
  // Section 0: 顶部 Logo
  // ═══════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "500 16px -apple-system, 'SF Pro Display', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("甜博士 · 决策实验室", CARD_W / 2, y);
  y += 14;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.fillText("Dr. Sweet Decision Lab", CARD_W / 2, y);

  // ═══════════════════════════════════════
  // Section 1: 人格揭示
  // ═══════════════════════════════════════
  y += 55;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "500 14px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("我的决策人格", CARD_W / 2, y);

  y += 52;
  ctx.fillStyle = color;
  ctx.font = "bold 52px -apple-system, 'SF Pro Display', sans-serif";
  ctx.fillText(`「${top1Info.name}」`, CARD_W / 2, y);

  y += 28;
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "16px -apple-system, sans-serif";
  ctx.fillText(top1Info.subtitle, CARD_W / 2, y);

  // 标签行
  y += 40;
  ctx.font = "500 13px -apple-system, sans-serif";
  const tag1 = `主导：${top1Info.name}`;
  const tag2 = `次级：${top2Info.name}`;
  const tag1W = ctx.measureText(tag1).width + 24;
  const tag2W = ctx.measureText(tag2).width + 24;
  const totalTagW = tag1W + 12 + tag2W;
  let tagX = (CARD_W - totalTagW) / 2;

  roundRect(ctx, tagX, y - 14, tag1W, 28, 14, color);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(tag1, tagX + tag1W / 2, y + 4);

  tagX += tag1W + 12;
  roundRect(ctx, tagX, y - 14, tag2W, 28, 14, "rgba(255,255,255,0.12)");
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(tag2, tagX + tag2W / 2, y + 4);

  // 置信度
  y += 30;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.textAlign = "center";
  if (data.confidence < 0.1) {
    ctx.fillText(
      `你在「${top1Info.name}」和「${top2Info.name}」之间频繁切换`,
      CARD_W / 2,
      y
    );
  } else {
    ctx.fillText(`置信度 ${confPct}%  ·  主导模式较为清晰`, CARD_W / 2, y);
  }

  // 雷达图
  y += 50;
  drawRadar(ctx, CARD_W / 2, y + 100, 95, data.personaDist, color);
  y += 220;

  // 描述
  y += 10;
  ctx.textAlign = "left";
  const descLines = wrapText(
    ctx,
    top1Info.description,
    CONTENT_W,
    "15px -apple-system, sans-serif"
  );
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "15px -apple-system, sans-serif";
  for (const line of descLines) {
    ctx.fillText(line, MARGIN, y);
    y += 24;
  }

  // ═══════════════════════════════════════
  // Section 2: 优势场景 & 高风险场景
  // ═══════════════════════════════════════
  y += 16;
  y = drawSeparator(ctx, y);
  y += 24;

  ctx.fillStyle = color;
  ctx.font = "bold 16px -apple-system, 'SF Pro Display', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("⚡ 优势场景 & 高风险场景", MARGIN, y);
  y += 28;

  // 优势
  const halfW = (CONTENT_W - 20) / 2;
  const strengthStartY = y;

  // 优势卡片背景
  roundRect(
    ctx,
    MARGIN,
    y - 6,
    halfW,
    24 + data.strengths.length * 48 + 12,
    10,
    "rgba(16, 185, 129, 0.08)"
  );
  // 优势标题
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText("✦ 优势场景", MARGIN + 14, y + 12);
  y += 32;

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "13px -apple-system, sans-serif";
  for (const s of data.strengths) {
    const lines = wrapText(ctx, `· ${s}`, halfW - 28, "13px -apple-system, sans-serif");
    for (const line of lines) {
      ctx.fillText(line, MARGIN + 14, y);
      y += 20;
    }
    y += 6;
  }
  const strengthEndY = y;

  // 风险卡片
  const riskX = MARGIN + halfW + 20;
  y = strengthStartY;

  roundRect(
    ctx,
    riskX,
    y - 6,
    halfW,
    24 + data.risks.length * 48 + 12,
    10,
    "rgba(239, 68, 68, 0.08)"
  );
  ctx.fillStyle = "#f87171";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText("⚠ 高风险场景", riskX + 14, y + 12);
  y += 32;

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "13px -apple-system, sans-serif";
  for (const r of data.risks) {
    const lines = wrapText(ctx, `· ${r}`, halfW - 28, "13px -apple-system, sans-serif");
    for (const line of lines) {
      ctx.fillText(line, riskX + 14, y);
      y += 20;
    }
    y += 6;
  }
  const riskEndY = y;

  y = Math.max(strengthEndY, riskEndY) + 8;

  // ═══════════════════════════════════════
  // Section 3: 行为证据
  // ═══════════════════════════════════════
  y = drawSeparator(ctx, y);
  y += 24;

  ctx.fillStyle = color;
  ctx.font = "bold 16px -apple-system, 'SF Pro Display', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("📊 行为证据", MARGIN, y);
  y += 24;

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "13px -apple-system, sans-serif";
  for (const ev of data.evidence) {
    const lines = wrapText(ctx, `· ${ev}`, CONTENT_W - 10, "13px -apple-system, sans-serif");
    for (const line of lines) {
      ctx.fillText(line, MARGIN + 10, y);
      y += 20;
    }
    y += 8;
  }

  // ═══════════════════════════════════════
  // Section 4: JD5 判断力盲区（完整版）
  // ═══════════════════════════════════════
  if (data.jd5Weak.length > 0) {
    y += 4;
    y = drawSeparator(ctx, y);
    y += 24;

    ctx.fillStyle = color;
    ctx.font = "bold 16px -apple-system, 'SF Pro Display', sans-serif";
    ctx.fillText("🛡️ JD5 判断力盲区", MARGIN, y);
    y += 8;

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText("基于你的决策人格，你最容易忽略的判断力步骤：", MARGIN, y + 14);
    y += 32;

    for (const weak of data.jd5Weak) {
      // 盲区卡片背景
      const cardLines = wrapText(
        ctx,
        weak.description,
        CONTENT_W - 40,
        "13px -apple-system, sans-serif"
      );
      const questionLines = wrapText(
        ctx,
        `💡 ${weak.question}`,
        CONTENT_W - 40,
        "12px -apple-system, sans-serif"
      );
      const cardH = 32 + cardLines.length * 20 + 8 + questionLines.length * 18 + 16;

      roundRect(ctx, MARGIN, y, CONTENT_W, cardH, 10, "rgba(245, 158, 11, 0.08)");

      // 标签 + 名称
      const badgeText = weak.name.split(" ")[0]; // e.g. "J2"
      const stepName = weak.name.replace(/^J\d\s*/, "");
      const badgeW = ctx.measureText(badgeText).width + 16;

      roundRect(ctx, MARGIN + 12, y + 10, badgeW, 22, 6, "rgba(245, 158, 11, 0.2)");
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 12px -apple-system, sans-serif";
      ctx.fillText(badgeText, MARGIN + 12 + 8, y + 24);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 14px -apple-system, sans-serif";
      ctx.fillText(stepName, MARGIN + 12 + badgeW + 8, y + 25);

      let cardY = y + 42;
      // 描述
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "13px -apple-system, sans-serif";
      for (const line of cardLines) {
        ctx.fillText(line, MARGIN + 20, cardY);
        cardY += 20;
      }
      cardY += 4;
      // 提问
      ctx.fillStyle = "#fbbf24";
      ctx.font = "12px -apple-system, sans-serif";
      for (const line of questionLines) {
        ctx.fillText(line, MARGIN + 20, cardY);
        cardY += 18;
      }

      y += cardH + 10;
    }
  }

  // ═══════════════════════════════════════
  // Section 5: 风险路径回放
  // ═══════════════════════════════════════
  if (data.trapOutcome && data.trapTitle) {
    y += 4;
    y = drawSeparator(ctx, y);
    y += 24;

    ctx.fillStyle = color;
    ctx.font = "bold 16px -apple-system, 'SF Pro Display', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`⚠️ 风险路径回放：${data.trapTitle}`, MARGIN, y);
    y += 28;

    // 时间线
    const timelineColors = ["#34d399", "#fbbf24", "#f87171"];
    for (let i = 0; i < data.trapOutcome.timeline.length; i++) {
      const item = data.trapOutcome.timeline[i];
      const dotColor = timelineColors[Math.min(i, 2)];

      // 时间线节点
      ctx.beginPath();
      ctx.arc(MARGIN + 16, y + 2, 6, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(MARGIN + 16, y + 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#0f0a1e";
      ctx.fill();

      // 连线
      if (i < data.trapOutcome.timeline.length - 1) {
        ctx.beginPath();
        ctx.moveTo(MARGIN + 16, y + 10);
        ctx.lineTo(MARGIN + 16, y + 52);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 时间标签
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 12px -apple-system, sans-serif";
      ctx.fillText(item.t, MARGIN + 32, y + 2);

      // 事件文本
      const evtLines = wrapText(
        ctx,
        item.text,
        CONTENT_W - 50,
        "13px -apple-system, sans-serif"
      );
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "13px -apple-system, sans-serif";
      let evtY = y + 18;
      for (const line of evtLines) {
        ctx.fillText(line, MARGIN + 32, evtY);
        evtY += 20;
      }
      y = evtY + 12;
    }

    // 状态变量面板
    y += 8;
    roundRect(ctx, MARGIN, y, CONTENT_W, 70, 10, "rgba(255,255,255,0.04)");
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "bold 11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("关键变量影响", CARD_W / 2, y + 16);

    const vars = [
      { key: "H" as const, label: "现金流" },
      { key: "S" as const, label: "结构" },
      { key: "R" as const, label: "风险" },
      { key: "V" as const, label: "验证" },
    ];
    const cellW = CONTENT_W / 4;
    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      const val = data.trapOutcome.stateDelta[v.key];
      const cx = MARGIN + cellW * i + cellW / 2;

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillText(v.label, cx, y + 34);

      const isPositive = val > 0;
      const isNegative = val < 0;
      // 风险值的颜色逻辑与其他相反
      if (v.key === "R") {
        ctx.fillStyle = isPositive
          ? "#f87171"
          : isNegative
          ? "#34d399"
          : "rgba(255,255,255,0.3)";
      } else {
        ctx.fillStyle = isPositive
          ? "#34d399"
          : isNegative
          ? "#f87171"
          : "rgba(255,255,255,0.3)";
      }
      ctx.font = "bold 18px -apple-system, sans-serif";
      ctx.fillText(val > 0 ? `+${val}` : `${val}`, cx, y + 56);
    }
    y += 82;
  }

  // ═══════════════════════════════════════
  // Section 6: 升级路径
  // ═══════════════════════════════════════
  if (data.upgradeTips.length > 0) {
    y += 4;
    y = drawSeparator(ctx, y);
    y += 24;

    ctx.fillStyle = color;
    ctx.font = "bold 16px -apple-system, 'SF Pro Display', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("⭐ 判断力升级路径", MARGIN, y);
    y += 24;

    for (let i = 0; i < data.upgradeTips.length; i++) {
      const tip = data.upgradeTips[i];
      const tipLines = wrapText(
        ctx,
        tip,
        CONTENT_W - 44,
        "13px -apple-system, sans-serif"
      );
      const tipH = tipLines.length * 20 + 16;

      roundRect(ctx, MARGIN, y, CONTENT_W, tipH, 10, "rgba(124, 58, 237, 0.08)");

      // 序号圆
      ctx.beginPath();
      ctx.arc(MARGIN + 18, y + tipH / 2, 11, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${i + 1}`, MARGIN + 18, y + tipH / 2 + 4);

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "13px -apple-system, sans-serif";
      let tipY = y + 16;
      for (const line of tipLines) {
        ctx.fillText(line, MARGIN + 38, tipY);
        tipY += 20;
      }

      y += tipH + 10;
    }
  }

  // ═══════════════════════════════════════
  // 底部区域：QR Code + URL
  // ═══════════════════════════════════════
  y += 20;
  y = drawSeparator(ctx, y);
  y += 24;

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
  const qrX = CARD_W - MARGIN - qrSize;
  const qrY = y;

  roundRect(
    ctx,
    qrX - 8,
    qrY - 8,
    qrSize + 16,
    qrSize + 16,
    12,
    "rgba(255,255,255,0.06)"
  );
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("扫码验证你的判断力", qrX + qrSize / 2, qrY + qrSize + 24);

  // 左侧文案
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "500 15px -apple-system, sans-serif";
  ctx.fillText("你也来测试一下？", MARGIN, qrY + 20);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.fillText("6-8 分钟 · 纯客户端 · 不存储数据", MARGIN, qrY + 44);

  ctx.fillStyle = color;
  ctx.font = "500 13px -apple-system, sans-serif";
  ctx.fillText("sweetdatalove.online", MARGIN, qrY + 70);

  y = Math.max(y + qrSize + 40, qrY + qrSize + 50);

  // 最底部 footer
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "甜博士决策实验室 · sweetdatalove.online · 结果仅供参考",
    CARD_W / 2,
    y
  );

  // ── 导出下载 ──────────────────────────
  canvas.toBlob((blob) => {
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

/* ── 计算总高度 ──────────────────────────── */
function calculateTotalHeight(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
  top1Info: { description: string },
  _color: string
): number {
  let h = 0;

  // Logo + 人格揭示 + 标签 + 置信度
  h += 60 + 14 + 55 + 52 + 28 + 40 + 30;

  // 雷达图
  h += 50 + 220;

  // 描述
  h += 10;
  const descLines = wrapText(
    ctx,
    top1Info.description,
    CONTENT_W,
    "15px -apple-system, sans-serif"
  );
  h += descLines.length * 24;

  // Section 2: 优势与风险
  h += 16 + 1 + 24 + 28; // separator + title
  let maxStrRiskH = 0;
  const halfW = (CONTENT_W - 20) / 2;
  // 优势高度
  let sH = 32;
  for (const s of data.strengths) {
    const lines = wrapText(ctx, `· ${s}`, halfW - 28, "13px -apple-system, sans-serif");
    sH += lines.length * 20 + 6;
  }
  // 风险高度
  let rH = 32;
  for (const r of data.risks) {
    const lines = wrapText(ctx, `· ${r}`, halfW - 28, "13px -apple-system, sans-serif");
    rH += lines.length * 20 + 6;
  }
  maxStrRiskH = Math.max(sH, rH);
  h += maxStrRiskH + 8;

  // Section 3: 行为证据
  h += 1 + 24 + 24; // separator + title
  for (const ev of data.evidence) {
    const lines = wrapText(ctx, `· ${ev}`, CONTENT_W - 10, "13px -apple-system, sans-serif");
    h += lines.length * 20 + 8;
  }

  // Section 4: JD5
  if (data.jd5Weak.length > 0) {
    h += 4 + 1 + 24 + 8 + 14 + 32; // separator + title + subtitle
    for (const weak of data.jd5Weak) {
      const cardLines = wrapText(
        ctx,
        weak.description,
        CONTENT_W - 40,
        "13px -apple-system, sans-serif"
      );
      const questionLines = wrapText(
        ctx,
        `💡 ${weak.question}`,
        CONTENT_W - 40,
        "12px -apple-system, sans-serif"
      );
      h += 32 + cardLines.length * 20 + 8 + questionLines.length * 18 + 16 + 10;
    }
  }

  // Section 5: 风险路径回放
  if (data.trapOutcome && data.trapTitle) {
    h += 4 + 1 + 24 + 28; // separator + title
    for (const item of data.trapOutcome.timeline) {
      const evtLines = wrapText(
        ctx,
        item.text,
        CONTENT_W - 50,
        "13px -apple-system, sans-serif"
      );
      h += 18 + evtLines.length * 20 + 12;
    }
    h += 8 + 82; // state delta panel
  }

  // Section 6: 升级路径
  if (data.upgradeTips.length > 0) {
    h += 4 + 1 + 24 + 24; // separator + title
    for (const tip of data.upgradeTips) {
      const tipLines = wrapText(
        ctx,
        tip,
        CONTENT_W - 44,
        "13px -apple-system, sans-serif"
      );
      h += tipLines.length * 20 + 16 + 10;
    }
  }

  // 底部区域
  h += 20 + 1 + 24 + 110 + 50 + 30; // QR + footer

  return h + 40; // 安全边距
}

/* ── 辅助函数 ──────────────────────────── */

function drawSeparator(ctx: CanvasRenderingContext2D, y: number): number {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(MARGIN, y);
  ctx.lineTo(CARD_W - MARGIN, y);
  ctx.stroke();
  return y;
}

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
    return {
      x: cx + radius * val * Math.cos(angle),
      y: cy + radius * val * Math.sin(angle),
    };
  }

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

  for (let i = 0; i < n; i++) {
    const p = getPoint(i, 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

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

  for (let i = 0; i < n; i++) {
    const val = 0.1 + (dist[PERSONAS_ORDER[i]] ?? 0) * 0.9;
    const p = getPoint(i, Math.min(val, 1));
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
  }

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

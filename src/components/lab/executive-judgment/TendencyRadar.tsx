"use client";

import type { Persona } from "@/lib/lab/decisionEngine";
import { PERSONA_INFO } from "@/lib/lab/personaMetadata";

interface TendencyRadarProps {
  personaDist: Record<Persona, number>;
  size?: number;
}

const PERSONAS_ORDER: Persona[] = ["E", "A", "D", "I", "O"];

/**
 * 纯 SVG 五维雷达图
 * 使用扩展 viewBox 保证长标签（如"完美主义者"）完整显示
 */
export function TendencyRadar({ personaDist, size = 240 }: TendencyRadarProps) {
  const pad = 30; // 标签溢出预留
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // 角度计算（从顶部开始，顺时针）
  function getPoint(index: number, value: number) {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    return {
      x: cx + radius * value * Math.cos(angle),
      y: cy + radius * value * Math.sin(angle),
    };
  }

  // 网格线
  const gridPaths = levels.map((level) => {
    const points = PERSONAS_ORDER.map((_, i) => getPoint(i, level));
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  });

  // 数据多边形
  const dataPoints = PERSONAS_ORDER.map((p, i) => {
    const val = personaDist[p] ?? 0;
    const normalized = 0.1 + val * 0.9;
    return getPoint(i, Math.min(normalized, 1));
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // 轴线
  const axes = PERSONAS_ORDER.map((_, i) => getPoint(i, 1));

  // 标签位置（稍微偏外）
  const labels = PERSONAS_ORDER.map((p, i) => {
    const pt = getPoint(i, 1.25);
    return { ...pt, persona: p };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-pad} ${-pad / 2} ${size + pad * 2} ${size + pad}`}
      className="mx-auto"
    >
      {/* 网格 */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5}
          className="text-slate-200 dark:text-slate-700"
        />
      ))}

      {/* 轴线 */}
      {axes.map((pt, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt.x}
          y2={pt.y}
          stroke="currentColor"
          strokeWidth={0.5}
          className="text-slate-200 dark:text-slate-700"
        />
      ))}

      {/* 数据区域 */}
      <polygon
        points={dataPath}
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth={2}
        className="text-violet-500 dark:text-violet-400"
      />

      {/* 数据点 */}
      {dataPoints.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={3.5}
          fill="currentColor"
          className="text-violet-600 dark:text-violet-400"
        />
      ))}

      {/* 标签 */}
      {labels.map((label) => (
        <text
          key={label.persona}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-600 text-[11px] font-medium dark:fill-slate-300"
        >
          {PERSONA_INFO[label.persona].name}
        </text>
      ))}
    </svg>
  );
}

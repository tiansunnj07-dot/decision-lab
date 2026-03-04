// lib/lab/evidenceGenerator.ts

export type Persona = "E" | "A" | "D" | "I" | "O";

export interface Answer {
  questionId: string;
  persona: Persona;
  cluster?: string;
  weight?: number; // default 1
}

export interface EvidenceContext {
  top1: Persona;
  top2: Persona;
  confidence: number; // top1Dist - top2Dist (0~1)
}

export interface EvidenceOptions {
  clusterNames?: Record<string, string>;
  minClusterN?: number;
  maxEvidence?: number;
}

type PersonaCount = Record<Persona, number>;

const PERSONAS: Persona[] = ["E", "A", "D", "I", "O"];

const PERSONA_NAME_CN: Record<Persona, string> = {
  E: "远征者",
  A: "结构师",
  D: "守城者",
  I: "直觉派",
  O: "完美主义者"
};

function confidenceBand(confidence: number): "high" | "mid" | "low" {
  if (confidence >= 0.18) return "high";
  if (confidence >= 0.1) return "mid";
  return "low";
}

function safeClusterName(cluster: string, map?: Record<string, string>) {
  return map?.[cluster] ?? cluster;
}

function initPersonaCount(): PersonaCount {
  return { E: 0, A: 0, D: 0, I: 0, O: 0 };
}

function sumCounts(c: PersonaCount): number {
  return PERSONAS.reduce((s, p) => s + c[p], 0);
}

function topTwoInCounts(counts: PersonaCount): { p1: Persona; v1: number; p2: Persona; v2: number } {
  const sorted = (Object.entries(counts) as [Persona, number][])
    .sort((a, b) => b[1] - a[1]);
  return { p1: sorted[0][0], v1: sorted[0][1], p2: sorted[1][0], v2: sorted[1][1] };
}

/**
 * 主函数：生成证据句
 */
export function generateEvidence(
  answers: Answer[],
  ctx: EvidenceContext,
  opts: EvidenceOptions = {}
): string[] {
  const minClusterN = opts.minClusterN ?? 2;
  const maxEvidence = opts.maxEvidence ?? 3;

  const global = globalEvidence(answers, ctx);
  const clusters = clusterEvidence(answers, ctx, {
    clusterNames: opts.clusterNames,
    minClusterN,
    limit: 2
  });
  const jd5 = jd5EvidenceFromBehavior(answers, ctx);

  const merged = [global, ...clusters, jd5].filter(Boolean);

  const uniq: string[] = [];
  for (const s of merged) {
    if (!uniq.includes(s)) uniq.push(s);
  }

  return uniq.slice(0, maxEvidence);
}

/** 证据 1：稳定性 */
function globalEvidence(answers: Answer[], ctx: EvidenceContext): string {
  const total = answers.length || 1;
  const top1Count = answers.filter((a) => a.persona === ctx.top1).length;

  const band = confidenceBand(ctx.confidence);

  if (band === "high") {
    return `你的决策模式较为稳定：在 ${total} 道题中，你有 ${top1Count} 次选择了更偏「${PERSONA_NAME_CN[ctx.top1]}」的路径。`;
  }
  if (band === "mid") {
    return `你有清晰的主导模式，但会在部分情境切换：在 ${total} 道题中，你有 ${top1Count} 次更偏「${PERSONA_NAME_CN[ctx.top1]}」，同时也会体现「${PERSONA_NAME_CN[ctx.top2]}」的策略。`;
  }
  return `你在两种模式之间切换更频繁：整体更偏「${PERSONA_NAME_CN[ctx.top1]}」，但「${PERSONA_NAME_CN[ctx.top2]}」也会在特定场景中出现。`;
}

/** 证据 2：按 cluster 找最强偏好 */
function clusterEvidence(
  answers: Answer[],
  ctx: EvidenceContext,
  cfg: { clusterNames?: Record<string, string>; minClusterN: number; limit: number }
): string[] {
  const byCluster: Record<string, PersonaCount> = {};
  const nByCluster: Record<string, number> = {};

  for (const a of answers) {
    if (!a.cluster) continue;
    byCluster[a.cluster] ??= initPersonaCount();
    nByCluster[a.cluster] ??= 0;
    const w = a.weight ?? 1;
    byCluster[a.cluster][a.persona] += w;
    nByCluster[a.cluster] += w;
  }

  type Ranked = { cluster: string; strength: number; p1: Persona; p2: Persona; ratio: number; n: number };
  const ranked: Ranked[] = [];

  for (const cluster of Object.keys(byCluster)) {
    const n = nByCluster[cluster];
    if (n < cfg.minClusterN) continue;

    const counts = byCluster[cluster];
    const { p1, v1, p2, v2 } = topTwoInCounts(counts);
    const ratio = v1 / Math.max(1, sumCounts(counts));
    const strength = (v1 - v2) / Math.max(1, sumCounts(counts));

    const relevant = (p1 === ctx.top1 || p1 === ctx.top2) && strength >= 0.2;
    if (!relevant) continue;

    ranked.push({ cluster, strength, p1, p2, ratio, n });
  }

  ranked.sort((a, b) => b.strength - a.strength);

  return ranked.slice(0, cfg.limit).map((r) => {
    const cName = safeClusterName(r.cluster, cfg.clusterNames);
    const pct = Math.round(r.ratio * 100);
    return `在「${cName}」相关题目中，你更常使用「${PERSONA_NAME_CN[r.p1]}」路径（约 ${pct}% 倾向），而不是「${PERSONA_NAME_CN[r.p2]}」式的处理方式。`;
  });
}

/** 证据 3：从行为推断一个"容易跳过的步骤" */
function jd5EvidenceFromBehavior(answers: Answer[], ctx: EvidenceContext): string {
  const map: Record<Persona, { step: string; hint: string }> = {
    E: { step: "结构拆解与风险预判", hint: "你更关注速度与动能，容易把增长等同于健康" },
    A: { step: "决策验证", hint: "你擅长建模与拆解，但需要把验证前移" },
    D: { step: "可验证的小步进入", hint: "你重视安全边际，但需要避免机会成本不可见" },
    I: { step: "结构变化与异常识别", hint: "你依赖经验与手感，但结构变化会让经验失效" },
    O: { step: "时间窗口与系统权衡", hint: "你追求确定性，但等待本身也是一种成本" }
  };

  const pick = map[ctx.top1];
  return `你的选择路径显示：你通常把优势发挥在「${PERSONA_NAME_CN[ctx.top1]}」式推进上，但在「${pick.step}」上需要更刻意补齐（${pick.hint}）。`;
}

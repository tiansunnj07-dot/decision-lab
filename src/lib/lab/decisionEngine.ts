// lib/lab/decisionEngine.ts

export type Persona = "E" | "A" | "D" | "I" | "O";
export type JD5Key = "J1" | "J2" | "J3" | "J4" | "J5";

export interface Answer {
  questionId: string;
  persona: Persona;
  cluster?: string;
  weight?: number; // default = 1
}

export interface IntroProfile {
  role?: string;
  industry?: string;
  stage?: string;
}

export interface OptionOutcome {
  timeline: { t: string; text: string }[];
  stateDelta: {
    H: number;
    S: number;
    R: number;
    V: number;
  };
  briefing: {
    shortTerm?: string;
    risk?: string;
    watchFor?: string;
  };
  jd5Next: JD5Key[];
}

export interface Trap {
  id: string;
  persona: Persona;
  questions: {
    id: string;
    optionOutcomes?: Record<string, OptionOutcome>;
  }[];
}

export interface LabResult {
  top1: Persona;
  top2: Persona;
  confidence: number;
  personaDist: Record<Persona, number>;
  evidence: string[];
  jd5WeakTop2: { key: JD5Key; score: number }[];
  trapId: string;
  trapOutcome?: OptionOutcome;
}

const PERSONAS: Persona[] = ["E", "A", "D", "I", "O"];

const PERSONA_WEAK_JD5: Record<Persona, JD5Key[]> = {
  E: ["J2", "J4"],
  A: ["J5"],
  D: ["J1", "J5"],
  I: ["J2", "J3"],
  O: ["J4", "J2"]
};

/**
 * 主入口
 */
export function runDecisionEngine(
  answers: Answer[],
  traps: Trap[],
  trapAnswers?: Record<string, string>
): LabResult {
  const personaDist = calculatePersonaDistribution(answers);
  const { top1, top2, confidence } = calculateTopPersonas(personaDist);

  const evidence = generateEvidence(answers, top1);
  const jd5WeakTop2 = calculateJD5Weakness(answers, top1);

  const trapId = `TRAP_${top1}_1`;
  const trapOutcome = resolveTrapOutcome(traps, trapId, trapAnswers);

  return {
    top1,
    top2,
    confidence,
    personaDist,
    evidence,
    jd5WeakTop2,
    trapId,
    trapOutcome
  };
}

/**
 * 计算人格分布
 */
function calculatePersonaDistribution(
  answers: Answer[]
): Record<Persona, number> {
  const scores: Record<Persona, number> = {
    E: 0,
    A: 0,
    D: 0,
    I: 0,
    O: 0
  };

  answers.forEach((a) => {
    const weight = a.weight ?? 1;
    scores[a.persona] += weight;
  });

  return normalize(scores);
}

/**
 * 归一化为 0~1 分布
 */
function normalize(
  scores: Record<Persona, number>
): Record<Persona, number> {
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  if (total === 0) return scores;

  const result: Record<Persona, number> = { ...scores };
  PERSONAS.forEach((p) => {
    result[p] = scores[p] / total;
  });

  return result;
}

/**
 * 计算 top1 / top2 / confidence
 */
function calculateTopPersonas(dist: Record<Persona, number>) {
  const sorted = Object.entries(dist)
    .sort((a, b) => b[1] - a[1]) as [Persona, number][];

  const top1 = sorted[0][0];
  const top2 = sorted[1][0];

  const confidence = sorted[0][1] - sorted[1][1];

  return { top1, top2, confidence };
}

/**
 * 生成行为证据（简单 cluster 统计）
 */
function generateEvidence(
  answers: Answer[],
  topPersona: Persona
): string[] {
  const total = answers.length;
  const matchCount = answers.filter(
    (a) => a.persona === topPersona
  ).length;

  const evidence: string[] = [];

  evidence.push(
    `在 ${total} 道题中，你有 ${matchCount} 次选择了更偏「${topPersona}」的路径。`
  );

  if (matchCount / total > 0.6) {
    evidence.push(
      `你的决策模式较为稳定，在多数场景优先使用同一种判断方式。`
    );
  } else {
    evidence.push(
      `你在不同场景中会切换判断模式，但仍存在主导倾向。`
    );
  }

  return evidence.slice(0, 3);
}

/**
 * 计算 JD5 弱项（简单版本：基于人格弱项）
 */
function calculateJD5Weakness(
  answers: Answer[],
  topPersona: Persona
): { key: JD5Key; score: number }[] {
  const weakKeys = PERSONA_WEAK_JD5[topPersona] || [];

  return weakKeys.map((key, index) => ({
    key,
    score: 1 - index * 0.1
  }));
}

/**
 * 解析陷阱关卡 outcome
 */
function resolveTrapOutcome(
  traps: Trap[],
  trapId: string,
  trapAnswers?: Record<string, string>
): OptionOutcome | undefined {
  if (!trapAnswers) return undefined;

  const trap = traps.find((t) => t.id === trapId);
  if (!trap) return undefined;

  const q3 = trap.questions[trap.questions.length - 1];

  if (!q3.optionOutcomes) return undefined;

  const userChoice = trapAnswers[q3.id];

  if (!userChoice) return undefined;

  return q3.optionOutcomes[userChoice];
}

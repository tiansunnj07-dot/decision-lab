// lib/lab/personaMetadata.ts
// 人格元数据：中文名、描述、优劣势、JD5 弱项映射

import type { Persona, JD5Key } from "./decisionEngine";

export interface PersonaInfo {
  key: Persona;
  name: string;
  subtitle: string;
  description: string;
  strengths: string[];
  risks: string[];
  color: string;
}

export const PERSONA_INFO: Record<Persona, PersonaInfo> = {
  E: {
    key: "E",
    name: "远征者",
    subtitle: "Expeditioner",
    description:
      "你的决策风格以速度和进攻性为核心。你倾向于快速行动、抢占先机，在增长和扩张中寻找机会。",
    strengths: [
      "善于抓住时间窗口，快速推进新机会",
      "在不确定环境中敢于先行一步",
      "能激发团队士气和执行速度",
    ],
    risks: [
      "容易忽略增长背后的结构风险",
      "扩张过快可能导致现金流压力",
      "短期势能可能掩盖长期问题",
    ],
    color: "violet",
  },
  A: {
    key: "A",
    name: "结构师",
    subtitle: "Architect",
    description:
      "你的决策风格以结构化分析为核心。你倾向于拆解问题、理清逻辑，在框架和模型中寻找答案。",
    strengths: [
      "擅长拆解复杂问题，找到结构性原因",
      "决策有框架支撑，逻辑清晰可复现",
      "善于识别数据中的关键变量",
    ],
    risks: [
      "分析可能过度，延误决策窗口",
      "框架之外的直觉信号容易被忽略",
      "过于依赖模型可能错失非线性变化",
    ],
    color: "blue",
  },
  D: {
    key: "D",
    name: "守城者",
    subtitle: "Defender",
    description:
      "你的决策风格以风险控制为核心。你倾向于评估下行风险、保护安全边际，在稳健中寻求确定性。",
    strengths: [
      "善于识别和控制下行风险",
      "决策有安全边际，避免灾难性损失",
      "在危机环境中保持冷静和纪律",
    ],
    risks: [
      "过度保守可能错失增长窗口",
      "安全优先可能抑制创新和进攻",
      "机会成本容易被低估",
    ],
    color: "emerald",
  },
  I: {
    key: "I",
    name: "直觉派",
    subtitle: "Intuitor",
    description:
      "你的决策风格以经验直觉为核心。你倾向于依靠积累的行业经验和模式识别快速做出判断。",
    strengths: [
      "决策速度快，不易被信息过载拖慢",
      "善于在模糊环境中快速定方向",
      "积累的行业经验形成独特竞争力",
    ],
    risks: [
      "经验可能在结构性变化中失效",
      "直觉难以被团队验证和复现",
      "容易低估新环境中的未知风险",
    ],
    color: "amber",
  },
  O: {
    key: "O",
    name: "完美主义者",
    subtitle: "Optimizer",
    description:
      "你的决策风格以精确度和确定性为核心。你倾向于收集充分信息、确保判断准确后再行动。",
    strengths: [
      "决策质量高，错误率低",
      "善于建立精确的指标体系",
      "输出经得起审计和复盘",
    ],
    risks: [
      "等待确定性可能错过最佳窗口",
      "过度追求精确可能增加决策成本",
      "在快速变化的环境中容易被动",
    ],
    color: "rose",
  },
};

/* ── JD5 五步模型 ─────────────────────────── */

export interface JD5StepInfo {
  key: JD5Key;
  name: string;
  description: string;
  question: string;
}

export const JD5_STEPS: Record<JD5Key, JD5StepInfo> = {
  J1: {
    key: "J1",
    name: "识别结构",
    description: "识别问题的核心结构和关键变量，区分噪音和信号。",
    question: "你是否在行动前识别了问题的核心结构？",
  },
  J2: {
    key: "J2",
    name: "拆解与建模",
    description: "将复杂问题拆解为可分析的子问题，建立判断框架。",
    question: "你是否对关键变量进行了结构化拆解？",
  },
  J3: {
    key: "J3",
    name: "异常识别",
    description: "识别数据或趋势中的异常信号，避免被表面指标误导。",
    question: "你是否注意到了数据中的异常或矛盾？",
  },
  J4: {
    key: "J4",
    name: "风险预判",
    description: "推演决策可能带来的下行风险和二阶效应。",
    question: "你是否推演了最坏情况和连锁反应？",
  },
  J5: {
    key: "J5",
    name: "验证与退出",
    description: "设置验证条件和退出机制，让决策可修正。",
    question: "你是否设置了验证周期和退出条件？",
  },
};

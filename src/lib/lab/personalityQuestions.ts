// lib/lab/personalityQuestions.ts

export type Persona = "E" | "A" | "D" | "I" | "O";

export type Question = {
  id: string;
  phase: "test";
  cluster:
    | "growth"
    | "profit"
    | "cash"
    | "risk"
    | "structure"
    | "anomaly"
    | "validation"
    | "timing"
    | "execution"
    | "pricing"
    | "metrics"
    | "strategy";
  weight: number;
  prompt: string;
  options: Array<{
    key: "A" | "B" | "C" | "D";
    text: string;
    persona: Persona;
  }>;
};

/** cluster 中文名映射 */
export const CLUSTER_NAMES: Record<string, string> = {
  growth: "增长与扩张",
  profit: "利润质量",
  cash: "现金流健康",
  risk: "风险与安全边际",
  structure: "结构与分层",
  anomaly: "异常识别",
  validation: "验证与迭代",
  timing: "时机与节奏",
  execution: "执行节奏",
  pricing: "定价与竞争",
  metrics: "指标与度量",
  strategy: "战略与取舍",
};

export const QUESTIONS_V1_18: Question[] = [
  {
    id: "Q1",
    phase: "test",
    cluster: "profit",
    weight: 1.5,
    prompt:
      "公司收入连续两年增长15%，但利润率下降3%。你第一反应更接近：",
    options: [
      { key: "A", text: "扩张期正常现象，先把规模做起来", persona: "E" },
      { key: "B", text: "先拆解收入与毛利结构，再判断增长质量", persona: "A" },
      { key: "C", text: "先评估现金流与偿付压力，避免结构性风险", persona: "D" },
      { key: "D", text: "结合过往类似阶段经验判断是否可控", persona: "I" },
    ],
  },
  {
    id: "Q2",
    phase: "test",
    cluster: "timing",
    weight: 1,
    prompt: "做重大决策前，数据/信息并不完整。你更倾向：",
    options: [
      { key: "A", text: "先行动，小步迭代，边做边补信息", persona: "E" },
      { key: "B", text: "信息不够就不拍板，先把确定性补齐", persona: "O" },
      { key: "C", text: "结构关键点清楚就推进，其它随执行补齐", persona: "A" },
      { key: "D", text: "依赖经验与直觉快速判断，别被数据拖慢", persona: "I" },
    ],
  },
  {
    id: "Q3",
    phase: "test",
    cluster: "risk",
    weight: 1.5,
    prompt: "一个客户贡献了40%收入。你更可能：",
    options: [
      { key: "A", text: "深度绑定合作，集中资源做大单", persona: "E" },
      { key: "B", text: "拆解依赖结构并设集中度红线，再推进合作", persona: "A" },
      { key: "C", text: "优先做风险对冲与替代来源，降低暴露", persona: "D" },
      { key: "D", text: "观察关系稳定性，凭经验判断风险不大", persona: "I" },
    ],
  },
  {
    id: "Q4",
    phase: "test",
    cluster: "profit",
    weight: 1,
    prompt: "利润短期下滑8%。你更倾向：",
    options: [
      { key: "A", text: "加大规模摊薄成本，先稳住增长势能", persona: "E" },
      { key: "B", text: "优化成本/毛利结构，找到下滑的结构原因", persona: "A" },
      { key: "C", text: "收紧开支、提高安全边际，先保现金流", persona: "D" },
      { key: "D", text: "先观察一个周期，确认是否持续再动作", persona: "O" },
    ],
  },
  {
    id: "Q5",
    phase: "test",
    cluster: "timing",
    weight: 1.5,
    prompt: "出现一个新市场窗口，但数据有限。你更可能：",
    options: [
      { key: "A", text: "先占位进入，别错过窗口", persona: "E" },
      { key: "B", text: "做最小试验验证关键假设，再放大", persona: "A" },
      { key: "C", text: "先做风险评估与最坏情景推演，再决定", persona: "D" },
      { key: "D", text: "参考行业先例与标杆打法，避免踩坑", persona: "I" },
    ],
  },
  {
    id: "Q6",
    phase: "test",
    cluster: "anomaly",
    weight: 1,
    prompt: "某季度关键指标异常波动。你第一步会：",
    options: [
      { key: "A", text: "判断是否趋势变化，必要时快速调整方向", persona: "E" },
      { key: "B", text: "追溯口径/链路，定位异常来源", persona: "A" },
      { key: "C", text: "先评估异常带来的风险暴露，避免扩大损失", persona: "D" },
      { key: "D", text: "结合经验判断是否重要，别被噪音带偏", persona: "I" },
    ],
  },
  {
    id: "Q7",
    phase: "test",
    cluster: "execution",
    weight: 1,
    prompt: "你更认可的决策节奏是：",
    options: [
      { key: "A", text: "快速决策，后期修正", persona: "E" },
      { key: "B", text: "结构清晰再行动，避免反复", persona: "A" },
      { key: "C", text: "风险可控再推进，宁稳勿躁", persona: "D" },
      { key: "D", text: "精确决策，尽量一次到位", persona: "O" },
    ],
  },
  {
    id: "Q8",
    phase: "test",
    cluster: "strategy",
    weight: 1,
    prompt: "团队意见分歧很大，你更倾向：",
    options: [
      { key: "A", text: "选增长潜力最大的方案，先打穿", persona: "E" },
      { key: "B", text: "拆分变量与假设，用结构化讨论收敛", persona: "A" },
      { key: "C", text: "选风险最低的方案，先稳住基本盘", persona: "D" },
      { key: "D", text: "听最有经验的人，快速拍板推进", persona: "I" },
    ],
  },
  {
    id: "Q9",
    phase: "test",
    cluster: "strategy",
    weight: 1,
    prompt: "预算有限，你优先投向：",
    options: [
      { key: "A", text: "高增长板块，换取更大空间", persona: "E" },
      { key: "B", text: "结构优化项目（提升决策质量/效率）", persona: "A" },
      { key: "C", text: "风险对冲与现金流安全措施", persona: "D" },
      { key: "D", text: "已验证成功、确定性更高的路径", persona: "O" },
    ],
  },
  {
    id: "Q10",
    phase: "test",
    cluster: "metrics",
    weight: 1,
    prompt: "两个关键指标结论相反（一个好看，一个变差）。你会：",
    options: [
      { key: "A", text: "看长期趋势与战略方向是否一致", persona: "E" },
      { key: "B", text: "先查口径与结构拆解，解释矛盾来源", persona: "A" },
      { key: "C", text: "优先按最坏情况处理，先控风险暴露", persona: "D" },
      { key: "D", text: "先暂停决策，直到把数据一致性弄清楚", persona: "O" },
    ],
  },
  {
    id: "Q11",
    phase: "test",
    cluster: "validation",
    weight: 1,
    prompt: "一个重大决策落地后，你最关心的复盘点是：",
    options: [
      { key: "A", text: "结果是否带来增长与规模", persona: "E" },
      { key: "B", text: "结构是否改善（来源/毛利/成本）", persona: "A" },
      { key: "C", text: "风险是否降低、是否更稳健", persona: "D" },
      { key: "D", text: "是否达到预期精度与控制标准", persona: "O" },
    ],
  },
  {
    id: "Q12",
    phase: "test",
    cluster: "risk",
    weight: 1,
    prompt: "面对高度不确定性，你更倾向：",
    options: [
      { key: "A", text: "抓住机会先上车", persona: "E" },
      { key: "B", text: "先控风险，把安全边际拉高", persona: "D" },
      { key: "C", text: "用经验判断关键变量，快速定方向", persona: "I" },
      { key: "D", text: "等信息更充分再行动", persona: "O" },
    ],
  },
  {
    id: "Q13",
    phase: "test",
    cluster: "cash",
    weight: 1.5,
    prompt:
      "应收账款周转天数连续上升，但收入仍增长。你更可能先做：",
    options: [
      { key: "A", text: "继续冲增长，规模起来现金流会改善", persona: "E" },
      { key: "B", text: "拆解回款结构（客户/合同/账期）找出原因", persona: "A" },
      { key: "C", text: "立刻收紧授信与回款政策，先保现金流", persona: "D" },
      { key: "D", text: "等下个周期确认是否持续，再调整", persona: "O" },
    ],
  },
  {
    id: "Q14",
    phase: "test",
    cluster: "validation",
    weight: 1.5,
    prompt:
      "你准备推出一个新策略，但不确定是否有效。你更认可的做法是：",
    options: [
      { key: "A", text: "全量推动，形成势能，边做边修", persona: "E" },
      { key: "B", text: "设计小实验：对照组/指标/周期/退出条件", persona: "A" },
      { key: "C", text: "先评估失败代价，失败不可承受就不做", persona: "D" },
      { key: "D", text: "先把数据与分析补全到足够确定再动", persona: "O" },
    ],
  },
  {
    id: "Q15",
    phase: "test",
    cluster: "structure",
    weight: 1,
    prompt: "一个指标\"好看\"但业务体感变差。你更可能相信：",
    options: [
      { key: "A", text: "指标代表趋势，体感可能是短期噪音", persona: "E" },
      { key: "B", text: "需要拆结构：哪个子人群/渠道/产品在变化", persona: "A" },
      { key: "C", text: "先按风险处理：体感变差可能是前兆", persona: "D" },
      { key: "D", text: "先暂停决策，直到把冲突解释清楚", persona: "O" },
    ],
  },
  {
    id: "Q16",
    phase: "test",
    cluster: "pricing",
    weight: 1,
    prompt: "竞争对手降价抢份额。你更可能的第一步是：",
    options: [
      { key: "A", text: "跟进降价，先把份额拿下", persona: "E" },
      { key: "B", text: "拆解价格弹性与客户分层，做差异化应对", persona: "A" },
      { key: "C", text: "不打价格战，优先控风险与现金流", persona: "D" },
      { key: "D", text: "先收集更多市场信息，再决定是否跟进", persona: "O" },
    ],
  },
  {
    id: "Q17",
    phase: "test",
    cluster: "strategy",
    weight: 1,
    prompt: "你最反感的决策方式是：",
    options: [
      { key: "A", text: "磨太久、错过窗口", persona: "E" },
      { key: "B", text: "不拆结构、直接拍脑袋", persona: "A" },
      { key: "C", text: "不评估风险、把公司当赌桌", persona: "D" },
      { key: "D", text: "信息不清楚就冲、缺少确定性", persona: "O" },
    ],
  },
  {
    id: "Q18",
    phase: "test",
    cluster: "metrics",
    weight: 1.5,
    prompt:
      "你要向董事会汇报\"公司健康度\"。你最优先展示哪类指标？",
    options: [
      { key: "A", text: "增长与市场份额（趋势最重要）", persona: "E" },
      { key: "B", text: "结构指标（来源/毛利/成本/集中度）", persona: "A" },
      { key: "C", text: "现金流与风险暴露（安全边际）", persona: "D" },
      { key: "D", text: "口径一致、精度高、可审计的指标体系", persona: "O" },
    ],
  },
];

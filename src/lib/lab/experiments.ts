export interface Experiment {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "coming-soon";
}

/**
 * 实验列表 — 新增实验只需在这里加一项
 * 页面和组件会自动渲染，无需改其他文件
 */
export const experiments: Experiment[] = [
  {
    slug: "prisoners-dilemma",
    title: "囚徒困境模拟器",
    description: "经典博弈论场景的交互模拟，体验合作与背叛的策略博弈。",
    tags: ["博弈论", "交互"],
    status: "coming-soon",
  },
  {
    slug: "bayes-calculator",
    title: "贝叶斯直觉训练",
    description: "通过可视化工具训练你的贝叶斯直觉，理解条件概率的力量。",
    tags: ["概率", "可视化"],
    status: "coming-soon",
  },
  {
    slug: "monte-carlo",
    title: "蒙特卡洛决策沙盘",
    description: "用随机模拟探索不确定性，帮助你在复杂场景中做出更好的决策。",
    tags: ["模拟", "决策"],
    status: "coming-soon",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  readingTime: string;
}

/**
 * 博客文章列表 — 新增文章只需在这里加一项
 * 页面和组件会自动渲染，无需改其他文件
 */
export const posts: BlogPost[] = [
  {
    slug: "taming-the-data-future",
    title: "驯服数据未来：AI 与大数据时代的个人进阶指南",
    description:
      "AI 大数据时代已经到来，就像大航海时代的美洲大草原上奔驰过一群烈马。你是四散奔逃，还是学习驾驭这种新物种？",
    tags: ["AI", "大数据", "职业发展", "数据产品经理"],
    date: "2026-03-04",
    readingTime: "10 分钟",
  },
  {
    slug: "spark-performance-tuning",
    title: "Spark 性能调优实战：从 OOM 到丝滑运行",
    description:
      "分享一次真实的 Spark 作业优化经历，从内存溢出到稳定运行的完整调优过程。",
    tags: ["Spark", "性能优化"],
    date: "2026-03-04",
    readingTime: "8 分钟",
  },
  {
    slug: "realtime-streaming-architecture",
    title: "实时流计算架构设计：从 Kafka 到 Flink",
    description:
      "如何设计一套高吞吐、低延迟的实时数据处理架构，以及踩过的坑。",
    tags: ["流计算", "架构"],
    date: "2026-03-01",
    readingTime: "12 分钟",
  },
  {
    slug: "data-modeling-best-practices",
    title: "数据建模最佳实践：维度建模 vs 宽表",
    description:
      "在不同业务场景下，如何选择合适的数据建模策略，附真实案例对比。",
    tags: ["数据建模", "数据仓库"],
    date: "2026-02-25",
    readingTime: "10 分钟",
  },
];

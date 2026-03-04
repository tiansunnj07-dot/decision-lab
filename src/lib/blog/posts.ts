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
];

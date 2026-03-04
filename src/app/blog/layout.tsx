import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大数据博客",
  description: "深入海量数据处理的核心——Spark 调优、实时流计算、数据建模与架构设计",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-cyan-50/30 to-white dark:from-cyan-950/10 dark:to-slate-950">
      {children}
    </div>
  );
}

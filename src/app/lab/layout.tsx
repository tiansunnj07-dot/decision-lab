import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "决策实验室",
  description: "用交互式工具拆解复杂决策——博弈论、贝叶斯推理、蒙特卡洛模拟",
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/30 to-white dark:from-violet-950/10 dark:to-slate-950">
      {children}
    </div>
  );
}

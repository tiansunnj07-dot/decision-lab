import Link from "next/link";
import { EntryCard } from "@/components/shared/EntryCard";
import { FlaskConical, Database, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-900/20" />
      </div>

      {/* 标题区域 */}
      <div className="relative z-10 mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
          <Sparkles className="h-4 w-4 text-amber-500" />
          欢迎来到甜博士的世界
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
          Dr. Sweet
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          科学决策 · 数据思维 · 深度探索
        </p>
      </div>

      {/* 双卡片区域 */}
      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <EntryCard
          href="/lab"
          icon={FlaskConical}
          title="甜博士决策实验室"
          subtitle="Decision Lab"
          description="用交互式工具拆解复杂决策。从博弈论到贝叶斯推理，从 A/B 测试到蒙特卡洛模拟——每一个决定，都值得被科学对待。"
          tags={["交互实验", "科学决策", "可视化", "博弈推演"]}
          actionText="进入实验室"
          colorScheme="violet"
        />
        <EntryCard
          href="/blog"
          icon={Database}
          title="甜博士大数据博客"
          subtitle="Big Data Blog"
          description="深入海量数据处理的核心。从 Spark 调优到实时流计算，从数据建模到架构设计——用深度思考驾驭数据洪流。"
          tags={["大数据", "深度思考", "架构设计", "实战经验"]}
          actionText="阅读博客"
          colorScheme="cyan"
        />
      </div>
    </div>
  );
}

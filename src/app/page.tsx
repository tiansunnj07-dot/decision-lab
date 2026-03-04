import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FlaskConical, BrainCircuit, ArrowRight, Sparkles, Database } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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

        {/* 卡片 1: 甜博士决策实验室 */}
        <Link href="/lab" className="group block">
          <Card className="relative h-full min-h-[360px] cursor-pointer overflow-hidden border-violet-200/60 bg-gradient-to-br from-white to-violet-50/50 transition-all duration-500 hover:scale-[1.02] hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-200/40 dark:border-violet-800/40 dark:from-slate-900 dark:to-violet-950/30 dark:hover:border-violet-600 dark:hover:shadow-violet-900/30">
            {/* 卡片内装饰光晕 */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl transition-all duration-500 group-hover:bg-violet-400/20 group-hover:scale-150" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-2xl transition-all duration-500 group-hover:bg-fuchsia-400/15" />

            <CardHeader className="pb-2">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 transition-colors duration-300 group-hover:bg-violet-200 dark:bg-violet-900/50 dark:group-hover:bg-violet-800/70">
                <FlaskConical className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                甜博士决策实验室
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                Decision Lab
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                用交互式工具拆解复杂决策。从博弈论到贝叶斯推理，从 A/B 测试到蒙特卡洛模拟——每一个决定，都值得被科学对待。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["交互实验", "科学决策", "可视化", "博弈推演"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-violet-100/80 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-all duration-300 group-hover:gap-3 dark:text-violet-400">
                进入实验室
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </CardFooter>
          </Card>
        </Link>

        {/* 卡片 2: 甜博士大数据博客 */}
        <Link href="/blog" className="group block">
          <Card className="relative h-full min-h-[360px] cursor-pointer overflow-hidden border-cyan-200/60 bg-gradient-to-br from-white to-cyan-50/50 transition-all duration-500 hover:scale-[1.02] hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-200/40 dark:border-cyan-800/40 dark:from-slate-900 dark:to-cyan-950/30 dark:hover:border-cyan-600 dark:hover:shadow-cyan-900/30">
            {/* 卡片内装饰光晕 */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-400/20 group-hover:scale-150" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-teal-400/10 blur-2xl transition-all duration-500 group-hover:bg-teal-400/15" />

            <CardHeader className="pb-2">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 transition-colors duration-300 group-hover:bg-cyan-200 dark:bg-cyan-900/50 dark:group-hover:bg-cyan-800/70">
                <Database className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                甜博士大数据博客
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                Big Data Blog
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                深入海量数据处理的核心。从 Spark 调优到实时流计算，从数据建模到架构设计——用深度思考驾驭数据洪流。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["大数据", "深度思考", "架构设计", "实战经验"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cyan-100/80 px-3 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-all duration-300 group-hover:gap-3 dark:text-cyan-400">
                阅读博客
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </CardFooter>
          </Card>
        </Link>

      </div>

      {/* 底部签名 */}
      <footer className="relative z-10 mt-16 text-center text-sm text-slate-400 dark:text-slate-500">
        <p>© 2026 Dr. Sweet · Built with curiosity and data</p>
      </footer>
    </main>
  );
}

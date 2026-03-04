import { ExperimentCard } from "@/components/lab/ExperimentCard";
import { experiments } from "@/lib/lab/experiments";
import { FlaskConical } from "lucide-react";

export default function LabPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* 页面标题 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/50">
          <FlaskConical className="h-8 w-8 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          甜博士决策实验室
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          每一个决定，都值得被科学对待
        </p>
      </div>

      {/* 实验卡片列表 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {experiments.map((exp) => (
          <ExperimentCard key={exp.slug} experiment={exp} />
        ))}
      </div>

      {/* 空状态 */}
      {experiments.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">实验正在准备中，敬请期待...</p>
        </div>
      )}
    </div>
  );
}

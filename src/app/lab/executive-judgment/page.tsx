"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BrainCircuit,
  Clock,
  ShieldCheck,
  Eye,
  ChevronRight,
} from "lucide-react";
import { useExperiment } from "@/components/lab/executive-judgment/ExperimentProvider";

export default function ExecutiveJudgmentEntryPage() {
  const router = useRouter();
  const { dispatch } = useExperiment();
  const [consent, setConsent] = useState(false);

  function handleStart() {
    dispatch({ type: "SET_CONSENT", value: true });
    dispatch({ type: "SET_STEP", step: "intro" });
    router.push("/lab/executive-judgment/intro");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 dark:bg-violet-900/50">
          <BrainCircuit className="h-10 w-10 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          高管判断力训练
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          这不是问卷。这是一场为你的决策模式设计的认知实验。
        </p>
      </div>

      {/* 说明卡片 */}
      <div className="mb-8 space-y-4 rounded-2xl border border-violet-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-violet-900/30 dark:bg-slate-900/50">
        {/* 实验说明 */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            实验说明
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            我们会通过 18 道商业决策场景，识别你的决策人格类型（远征者、结构师、守城者、直觉派、完美主义者），
            然后用一个「陷阱关卡」暴露你的认知盲区——不是判对错，而是让你看见自己的判断路径。
          </p>
        </div>

        <Separator className="bg-violet-100 dark:bg-violet-900/30" />

        {/* 承诺 */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">不判对错</span>
              <br />
              只分析你的决策路径
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">6-8 分钟</span>
              <br />
              完成全部流程
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">不存储数据</span>
              <br />
              所有计算在浏览器完成
            </p>
          </div>
        </div>

        <Separator className="bg-violet-100 dark:bg-violet-900/30" />

        {/* JD5 方法论简介 */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            基于 JD5 判断力模型
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {[
              "识别结构",
              "拆解与建模",
              "异常识别",
              "风险预判",
              "验证与退出",
            ].map((step, i) => (
              <Badge
                key={step}
                variant="secondary"
                className="bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
              >
                J{i + 1} {step}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            甜博士基于商业决策研究提炼的五步判断力框架
          </p>
        </div>
      </div>

      {/* 同意勾选 */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5 border-violet-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
        />
        <label
          htmlFor="consent"
          className="cursor-pointer text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          我理解这是一个模拟决策系统，结果仅供参考，不构成专业建议。
        </label>
      </div>

      {/* CTA */}
      <Button
        onClick={handleStart}
        disabled={!consent}
        size="lg"
        className="w-full bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 dark:bg-violet-500 dark:hover:bg-violet-600"
      >
        开始实验
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>

      {/* 底部链接 */}
      <div className="mt-6 flex justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
        <a href="/privacy" className="hover:text-violet-500 transition-colors">
          隐私声明
        </a>
        <span>·</span>
        <a href="/terms" className="hover:text-violet-500 transition-colors">
          使用条款
        </a>
        <span>·</span>
        <a href="/about" className="hover:text-violet-500 transition-colors">
          关于方法论
        </a>
      </div>
    </div>
  );
}

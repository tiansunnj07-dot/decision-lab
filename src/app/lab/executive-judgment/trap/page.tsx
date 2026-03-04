"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useExperiment } from "@/components/lab/executive-judgment/ExperimentProvider";
import { getTrapByPersona, type TrapScenario } from "@/lib/lab/trapData";
import { runDecisionEngine, type Trap } from "@/lib/lab/decisionEngine";
import { TRAP_SCENARIOS } from "@/lib/lab/trapData";

type TrapPhase = "intro" | "q1" | "q2" | "q3" | "outcome";

export default function TrapPage() {
  const router = useRouter();
  const { state, dispatch } = useExperiment();
  const [phase, setPhase] = useState<TrapPhase>("intro");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [localTrapAnswers, setLocalTrapAnswers] = useState<Record<string, string>>({});

  // 根据 labResult 中的 top1 选择陷阱
  const topPersona = state.labResult?.top1 ?? "E";
  const trap = useMemo(() => getTrapByPersona(topPersona), [topPersona]);

  if (!trap) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">陷阱数据加载失败</p>
      </div>
    );
  }

  const questionIndex = phase === "q1" ? 0 : phase === "q2" ? 1 : phase === "q3" ? 2 : -1;
  const currentQuestion = questionIndex >= 0 ? trap.questions[questionIndex] : null;

  // 获取 Q3 选择后的 outcome
  const q3Answer = localTrapAnswers[trap.questions[2]?.id];
  const q3Outcomes = trap.questions[2]?.optionOutcomes;
  const selectedOutcome = q3Answer && q3Outcomes ? q3Outcomes[q3Answer] : null;

  /* ── 开始陷阱关 ────────────────── */
  function handleStartTrap() {
    setPhase("q1");
  }

  /* ── 选择选项 ────────────────── */
  function handleSelect(questionId: string, optionKey: string) {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // 存储答案
    const newAnswers = { ...localTrapAnswers, [questionId]: optionKey };
    setLocalTrapAnswers(newAnswers);
    dispatch({ type: "SET_TRAP_ANSWER", questionId, optionKey });

    setTimeout(() => {
      if (phase === "q1") {
        setPhase("q2");
      } else if (phase === "q2") {
        setPhase("q3");
      } else if (phase === "q3") {
        // 重新计算带陷阱结果的 LabResult
        const traps: Trap[] = TRAP_SCENARIOS.map((t) => ({
          id: t.id,
          persona: t.persona,
          questions: t.questions.map((q) => ({
            id: q.id,
            optionOutcomes: q.optionOutcomes,
          })),
        }));
        const result = runDecisionEngine(state.testAnswers, traps, newAnswers);
        dispatch({ type: "SET_LAB_RESULT", result });
        setPhase("outcome");
      }
      setIsTransitioning(false);
    }, 400);
  }

  /* ── 跳转到报告 ────────────────── */
  function handleToReport() {
    dispatch({ type: "SET_STEP", step: "report" });
    router.push("/lab/executive-judgment/report");
  }

  /* ── Intro ────────────────────── */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40">
            <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            陷阱关卡
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {trap.title}
          </h1>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
            {trap.subtitle}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            接下来你会面对 3 个连续决策场景。每个选择都会影响后续情境。
            <br />
            <span className="mt-2 inline-block font-medium text-slate-900 dark:text-white">
              做你真实会做的选择，不要猜"正确答案"。
            </span>
          </p>
        </div>

        <Button
          onClick={handleStartTrap}
          size="lg"
          className="mt-8 w-full bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          进入关卡
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    );
  }

  /* ── Outcome ────────────────────── */
  if (phase === "outcome" && selectedOutcome) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            你的选择带来了什么？
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            基于你的决策路径，以下是模拟推演的后果
          </p>
        </div>

        {/* 时间线 */}
        <div className="mb-8 space-y-0">
          {selectedOutcome.timeline.map((item, i) => (
            <div key={i} className="relative flex gap-4 pb-6">
              {/* 时间线线条 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                    i === 0
                      ? "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/30"
                      : i === 1
                      ? "border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
                      : "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30"
                  }`}
                >
                  <Clock
                    className={`h-4 w-4 ${
                      i === 0
                        ? "text-green-600 dark:text-green-400"
                        : i === 1
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                </div>
                {i < selectedOutcome.timeline.length - 1 && (
                  <div className="h-full w-px bg-slate-200 dark:bg-slate-700" />
                )}
              </div>
              {/* 内容 */}
              <div className="pt-1.5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.t}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 状态变量条 */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            关键变量变化
          </h3>
          <div className="space-y-3">
            {(
              [
                { key: "H", label: "现金流健康", color: "emerald" },
                { key: "S", label: "结构质量", color: "blue" },
                { key: "R", label: "风险暴露", color: "red" },
                { key: "V", label: "验证程度", color: "violet" },
              ] as const
            ).map(({ key, label, color }) => {
              const val = selectedOutcome.stateDelta[key];
              const absVal = Math.abs(val);
              const barWidth = Math.min(absVal * 2, 100);

              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {label}
                  </span>
                  <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className={`absolute left-1/2 top-0 h-full rounded-full transition-all duration-700 ${
                        val >= 0
                          ? key === "R"
                            ? "bg-red-400 dark:bg-red-500"
                            : `bg-${color}-400 dark:bg-${color}-500`
                          : key === "R"
                          ? "bg-emerald-400 dark:bg-emerald-500"
                          : "bg-red-400 dark:bg-red-500"
                      }`}
                      style={{
                        width: `${barWidth / 2}%`,
                        ...(val >= 0
                          ? { left: "50%" }
                          : { right: "50%", left: "auto" }),
                      }}
                    />
                    <div className="absolute left-1/2 top-0 h-full w-px bg-slate-300 dark:bg-slate-600" />
                  </div>
                  <span
                    className={`flex w-12 items-center gap-0.5 text-xs font-medium ${
                      val > 0
                        ? key === "R"
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                        : val < 0
                        ? key === "R"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                        : "text-slate-400"
                    }`}
                  >
                    {val > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : val < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {val > 0 ? `+${val}` : val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 冷静洞察 */}
        <div className="mb-8 rounded-xl border border-violet-200 bg-violet-50/50 p-5 dark:border-violet-800 dark:bg-violet-900/20">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-200">
              洞察
            </h3>
          </div>
          <div className="space-y-2">
            {trap.insight.map((line, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleToReport}
          size="lg"
          className="w-full bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          查看完整报告
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    );
  }

  /* ── 题目 Q1/Q2/Q3 ────────────────── */
  if (!currentQuestion) return null;

  const briefingForPrev =
    questionIndex > 0
      ? (() => {
          const prevQ = trap.questions[questionIndex - 1];
          const prevAnswer = localTrapAnswers[prevQ.id];
          const prevOption = prevQ.options.find((o) => o.key === prevAnswer);
          return prevOption?.briefing;
        })()
      : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* 陷阱进度 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {trap.title}
          </Badge>
          <span className="text-xs text-slate-400">
            {questionIndex + 1} / {trap.questions.length}
          </span>
        </div>
        <Progress
          value={((questionIndex + 1) / trap.questions.length) * 100}
          className="h-1.5 bg-amber-100 dark:bg-amber-900/30 [&>div]:bg-amber-500 dark:[&>div]:bg-amber-400"
        />
      </div>

      {/* 前一题的 briefing（短期收益提示） */}
      {briefingForPrev && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            📊 {briefingForPrev}
          </p>
        </div>
      )}

      {/* 题目 */}
      <div
        className={`transition-all duration-400 ${
          isTransitioning
            ? "translate-x-[-20px] opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <p className="mb-6 text-lg font-medium leading-relaxed text-slate-900 dark:text-white">
          {currentQuestion.prompt}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(currentQuestion.id, opt.key)}
              disabled={isTransitioning}
              className="group w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-sm active:scale-[0.98] disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-violet-600 dark:hover:bg-violet-900/20"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-medium text-slate-500 transition-colors group-hover:border-violet-400 group-hover:text-violet-600 dark:border-slate-600 dark:text-slate-400">
                  {opt.key}
                </span>
                <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {opt.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

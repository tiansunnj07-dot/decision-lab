"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BrainCircuit } from "lucide-react";
import { useExperiment } from "@/components/lab/executive-judgment/ExperimentProvider";
import { QUESTIONS_V1_18, CLUSTER_NAMES } from "@/lib/lab/personalityQuestions";
import { runDecisionEngine } from "@/lib/lab/decisionEngine";
import { TRAP_SCENARIOS } from "@/lib/lab/trapData";
import type { Answer, Trap } from "@/lib/lab/decisionEngine";

type Phase = "test" | "computing";

/** Fisher-Yates 洗牌算法 */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TestPage() {
  const router = useRouter();
  const { state, dispatch } = useExperiment();
  const [phase, setPhase] = useState<Phase>("test");
  const [currentIndex, setCurrentIndex] = useState(state.testAnswers.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [computingStep, setComputingStep] = useState(0);

  // 将每道题的选项顺序随机打乱（仅展示层，不影响后端计算）
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledQuestions = useMemo(
    () =>
      QUESTIONS_V1_18.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      })),
    []
  );

  const total = shuffledQuestions.length;
  const question = shuffledQuestions[currentIndex];
  const progress = (currentIndex / total) * 100;

  /* ── 选择选项 ────────────────────────── */
  const handleSelect = useCallback(
    (optionKey: string) => {
      if (isTransitioning || !question) return;

      const option = question.options.find((o) => o.key === optionKey);
      if (!option) return;

      const answer: Answer = {
        questionId: question.id,
        persona: option.persona,
        cluster: question.cluster,
        weight: question.weight,
      };

      dispatch({ type: "ADD_TEST_ANSWER", answer });
      setIsTransitioning(true);

      // 0.4s 后进入下一题
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx >= total) {
          // 所有题答完 → 进入计算过场
          setPhase("computing");
        } else {
          setCurrentIndex(nextIdx);
        }
        setIsTransitioning(false);
      }, 400);
    },
    [currentIndex, dispatch, isTransitioning, question, total]
  );

  /* ── 返回上一题 ────────────────────────── */
  function handleBack() {
    if (currentIndex <= 0 || isTransitioning) return;
    dispatch({ type: "UNDO_TEST_ANSWER" });
    setCurrentIndex(currentIndex - 1);
  }

  /* ── 计算过场动画 ────────────────────────── */
  useEffect(() => {
    if (phase !== "computing") return;

    const messages = [
      "正在分析你的决策路径…",
      "识别你的判断模式…",
      "匹配陷阱关卡…",
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setComputingStep(step);
      if (step >= messages.length) {
        clearInterval(interval);
        // 引擎计算
        const traps: Trap[] = TRAP_SCENARIOS.map((t) => ({
          id: t.id,
          persona: t.persona,
          questions: t.questions.map((q) => ({
            id: q.id,
            optionOutcomes: q.optionOutcomes,
          })),
        }));
        const result = runDecisionEngine(state.testAnswers, traps);
        dispatch({ type: "SET_LAB_RESULT", result });
        dispatch({ type: "SET_STEP", step: "trap" });
        setTimeout(() => {
          router.push("/lab/executive-judgment/trap");
        }, 800);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [phase, state.testAnswers, dispatch, router]);

  /* ── 计算过场 UI ────────────────────────── */
  if (phase === "computing") {
    const messages = [
      "正在分析你的决策路径…",
      "识别你的判断模式…",
      "匹配陷阱关卡…",
    ];

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
          <BrainCircuit className="h-10 w-10 animate-pulse text-violet-600 dark:text-violet-400" />
        </div>
        <div className="space-y-3 text-center">
          {messages.map((msg, i) => (
            <p
              key={i}
              className={`text-sm transition-all duration-500 ${
                i <= computingStep
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              } ${
                i === computingStep
                  ? "text-violet-600 font-medium dark:text-violet-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {msg}
            </p>
          ))}
        </div>
        <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
          我们不看答案对错。我们看你的选择路径。
        </p>
      </div>
    );
  }

  /* ── 题目不存在（安全检查） ────────────── */
  if (!question) {
    return null;
  }

  /* ── 测试 UI ────────────────────────── */
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            第 {currentIndex + 1} / {total} 题
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-violet-100 dark:bg-violet-900/30 [&>div]:bg-violet-600 dark:[&>div]:bg-violet-500"
        />
      </div>

      {/* 题目卡片 */}
      <div
        className={`transition-all duration-400 ${
          isTransitioning
            ? "translate-x-[-20px] opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        {/* 题干 */}
        <div className="mb-6">
          <p className="text-lg font-medium leading-relaxed text-slate-900 dark:text-white">
            {question.prompt}
          </p>
        </div>

        {/* 选项（顺序已随机打乱） */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              disabled={isTransitioning}
              className="group w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-sm active:scale-[0.98] disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-violet-600 dark:hover:bg-violet-900/20"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-medium text-slate-500 transition-colors group-hover:border-violet-400 group-hover:text-violet-600 dark:border-slate-600 dark:text-slate-400 dark:group-hover:border-violet-500 dark:group-hover:text-violet-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {opt.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 返回按钮 */}
      {currentIndex > 0 && (
        <div className="mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isTransitioning}
            className="text-slate-400 hover:text-violet-600"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            上一题
          </Button>
        </div>
      )}
    </div>
  );
}

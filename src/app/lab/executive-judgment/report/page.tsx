"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Zap,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Target,
  BookOpen,
  Star,
  Loader2,
} from "lucide-react";
import { useExperiment } from "@/components/lab/executive-judgment/ExperimentProvider";
import { PERSONA_INFO, JD5_STEPS } from "@/lib/lab/personaMetadata";
import { generateEvidence } from "@/lib/lab/evidenceGenerator";
import { CLUSTER_NAMES } from "@/lib/lab/personalityQuestions";
import { getTrapByPersona } from "@/lib/lab/trapData";
import { downloadShareCard } from "@/lib/lab/generateShareCard";
import { TendencyRadar } from "@/components/lab/executive-judgment/TendencyRadar";

export default function ReportPage() {
  const router = useRouter();
  const { state, dispatch } = useExperiment();
  const contentRef = useRef<HTMLDivElement>(null);
  const result = state.labResult;
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成高级证据
  const evidence = useMemo(() => {
    if (!result) return [];
    return generateEvidence(
      state.testAnswers,
      { top1: result.top1, top2: result.top2, confidence: result.confidence },
      { clusterNames: CLUSTER_NAMES, maxEvidence: 3, minClusterN: 2 }
    );
  }, [result, state.testAnswers]);

  // 获取陷阱信息
  const trap = useMemo(
    () => (result ? getTrapByPersona(result.top1) : undefined),
    [result]
  );

  if (!result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-slate-400 dark:text-slate-500">
          未找到实验结果，请先完成测试。
        </p>
        <Button
          variant="ghost"
          className="mt-4 text-violet-600"
          onClick={() => router.push("/lab/executive-judgment")}
        >
          返回实验入口
        </Button>
      </div>
    );
  }

  const top1Info = PERSONA_INFO[result.top1];
  const top2Info = PERSONA_INFO[result.top2];
  const confidencePercent = Math.round(result.confidence * 100);
  const isLowConfidence = result.confidence < 0.1;

  function handleRestart() {
    dispatch({ type: "RESET" });
    router.push("/lab/executive-judgment");
  }

  async function handleDownloadCard() {
    if (!contentRef.current || !result || isGenerating) return;

    setIsGenerating(true);
    try {
      await downloadShareCard(contentRef.current, result.top1);
    } catch (e) {
      console.error("生成报告卡片失败:", e);
      alert("生成报告卡片失败：" + (e instanceof Error ? e.message : "未知错误"));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* ═══════════════════════════════════════
       * 报告内容区域（用于截图导出）
       * ═══════════════════════════════════════ */}
      <div ref={contentRef}>
        {/* ─── Section 1: 人格揭示 ─── */}
        <section className="mb-10">
          <div className="text-center">
            <Badge className="mb-3 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              你的决策人格
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {top1Info.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {top1Info.subtitle}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                主导：{top1Info.name}
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                次级：{top2Info.name}
              </span>
            </div>

            <div className="mt-3">
              {isLowConfidence ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚡ 你在「{top1Info.name}」和「{top2Info.name}
                  」两种模式间频繁切换
                </p>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  置信度：{confidencePercent}% — 你的主导模式较为清晰
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-violet-100 bg-white/80 p-5 dark:border-violet-900/30 dark:bg-slate-900/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {top1Info.description}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              决策倾向分布
            </h3>
            <TendencyRadar personaDist={result.personaDist} size={260} />
          </div>
        </section>

        <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

        {/* ─── Section 2: 优势与风险 ─── */}
        <section className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Target className="h-5 w-5 text-violet-500" />
            优势场景 & 高风险场景
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <Zap className="h-4 w-4" /> 优势场景
              </h3>
              <ul className="space-y-2">
                {top1Info.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    • {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-300">
                <AlertTriangle className="h-4 w-4" /> 高风险场景
              </h3>
              <ul className="space-y-2">
                {top1Info.risks.map((r, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    • {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

        {/* ─── Section 3: 行为证据 ─── */}
        <section className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <BookOpen className="h-5 w-5 text-violet-500" />
            行为证据
          </h2>
          <div className="space-y-3">
            {evidence.map((e, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50"
              >
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {e}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

        {/* ─── Section 4: JD5 判断力盲区 ─── */}
        <section className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Shield className="h-5 w-5 text-violet-500" />
            JD5 判断力盲区
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            基于你的决策人格，你最容易忽略的判断力步骤：
          </p>
          <div className="space-y-3">
            {result.jd5WeakTop2.map((weak) => {
              const step = JD5_STEPS[weak.key];
              return (
                <div
                  key={weak.key}
                  className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    >
                      {weak.key}
                    </Badge>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {step.name}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    💡 {step.question}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

        {/* ─── Section 5: 风险路径回放 ─── */}
        {result.trapOutcome && trap && (
          <>
            <section className="mb-10">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="h-5 w-5 text-violet-500" />
                风险路径回放：{trap.title}
              </h2>

              <div className="mb-6 space-y-0">
                {result.trapOutcome.timeline.map((item, i) => (
                  <div key={i} className="relative flex gap-4 pb-5">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          i === 0
                            ? "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/30"
                            : i === 1
                            ? "border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
                            : "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30"
                        }`}
                      >
                        <Clock
                          className={`h-3.5 w-3.5 ${
                            i === 0
                              ? "text-green-600 dark:text-green-400"
                              : i === 1
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        />
                      </div>
                      {i < result.trapOutcome!.timeline.length - 1 && (
                        <div className="h-full w-px bg-slate-200 dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.t}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <h3 className="mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  关键变量影响
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      { key: "H" as const, label: "现金流" },
                      { key: "S" as const, label: "结构" },
                      { key: "R" as const, label: "风险" },
                      { key: "V" as const, label: "验证" },
                    ] as const
                  ).map(({ key, label }) => {
                    const val = result.trapOutcome!.stateDelta[key];
                    return (
                      <div key={key} className="text-center">
                        <p className="text-xs text-slate-400">{label}</p>
                        <p
                          className={`mt-0.5 text-lg font-bold ${
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
                          {val > 0 ? `+${val}` : val}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />
          </>
        )}

        {/* ─── Section 6: 升级路径 ─── */}
        <section className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Star className="h-5 w-5 text-violet-500" />
            判断力升级路径
          </h2>

          {trap && (
            <div className="space-y-3">
              {trap.upgradeTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-900/30 dark:bg-violet-900/10"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ═══════════════════════════════════════
       * CTA 按钮组（不包含在截图范围内）
       * ═══════════════════════════════════════ */}
      <div className="mb-10 space-y-3">
        <Button
          onClick={handleDownloadCard}
          disabled={isGenerating}
          size="lg"
          className="w-full bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中…
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              下载完整报告卡
            </>
          )}
        </Button>

        <Button
          onClick={() => router.push("/about")}
          variant="outline"
          size="lg"
          className="w-full border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-900/20"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          了解 JD5 判断力模型
        </Button>

        <Button
          onClick={handleRestart}
          variant="ghost"
          size="lg"
          className="w-full text-slate-500 hover:text-violet-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          重新做一次实验
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>本报告由甜博士决策实验室生成，基于 JD5 判断力模型。</p>
        <p className="mt-1">结果仅供参考，不构成专业决策建议。</p>
        <div className="mt-3 flex justify-center gap-3">
          <a
            href="/privacy"
            className="transition-colors hover:text-violet-500"
          >
            隐私声明
          </a>
          <span>·</span>
          <a href="/terms" className="transition-colors hover:text-violet-500">
            使用条款
          </a>
        </div>
      </div>
    </div>
  );
}

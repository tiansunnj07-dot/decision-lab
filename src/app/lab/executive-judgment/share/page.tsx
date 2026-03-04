"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PERSONA_INFO } from "@/lib/lab/personaMetadata";
import type { Persona } from "@/lib/lab/decisionEngine";
import { Suspense } from "react";

function ShareContent() {
  const searchParams = useSearchParams();
  const personaKey = (searchParams.get("p") ?? "E") as Persona;
  const confidenceStr = searchParams.get("c") ?? "0";
  const confidence = parseInt(confidenceStr, 10);

  const persona = PERSONA_INFO[personaKey] ?? PERSONA_INFO.E;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-20">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 dark:bg-violet-900/50">
          <BrainCircuit className="h-10 w-10 text-violet-600 dark:text-violet-400" />
        </div>

        {/* 标签 */}
        <Badge className="mb-3 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
          甜博士 · 判断力训练
        </Badge>

        {/* 人格展示 */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          我的决策人格是
          <br />
          <span className="text-violet-600 dark:text-violet-400">
            「{persona.name}」
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          {persona.subtitle}
        </p>

        {/* 描述 */}
        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-violet-100 bg-white/80 p-5 dark:border-violet-900/30 dark:bg-slate-900/50">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {persona.description}
          </p>
          {confidence > 0 && (
            <p className="mt-3 text-xs text-violet-500 dark:text-violet-400">
              置信度：{confidence}%
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 space-y-3">
          <Link href="/lab/executive-judgment">
            <Button
              size="lg"
              className="w-full bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              你也来验证一下
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            6-8 分钟 · 不存储数据 · 纯客户端计算
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { UserCircle, ChevronRight, SkipForward } from "lucide-react";
import { useExperiment } from "@/components/lab/executive-judgment/ExperimentProvider";
import type { IntroProfile } from "@/lib/lab/decisionEngine";

const ROLES = [
  { value: "ceo", label: "CEO / 创始人" },
  { value: "cxo", label: "CXO / VP" },
  { value: "director", label: "总监 / 中层管理" },
  { value: "head", label: "业务负责人" },
  { value: "analyst-lead", label: "分析负责人" },
  { value: "explore", label: "个人探索" },
];

const INDUSTRIES = [
  { value: "internet", label: "互联网 / 科技" },
  { value: "finance", label: "金融 / 投资" },
  { value: "manufacturing", label: "制造 / 工业" },
  { value: "tob", label: "ToB / 企业服务" },
  { value: "retail", label: "零售 / 消费" },
  { value: "other", label: "其他行业" },
];

const STAGES = [
  { value: "0-1", label: "0-1 探索期" },
  { value: "1-10", label: "1-10 成长期" },
  { value: "mature", label: "成熟期 / 上市" },
];

export default function IntroPage() {
  const router = useRouter();
  const { dispatch } = useExperiment();

  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [speedBias, setSpeedBias] = useState([50]); // 0=偏速度 100=偏确定性

  function handleContinue() {
    const profile: IntroProfile = {
      role: role || undefined,
      industry: industry || undefined,
      stage: stage || undefined,
    };
    dispatch({ type: "SET_INTRO_PROFILE", profile });
    dispatch({ type: "SET_STEP", step: "test" });
    router.push("/lab/executive-judgment/test");
  }

  function handleSkip() {
    dispatch({ type: "SET_INTRO_PROFILE", profile: {} });
    dispatch({ type: "SET_STEP", step: "test" });
    router.push("/lab/executive-judgment/test");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-20">
      {/* 标题 */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/50">
          <UserCircle className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          身份设定
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          以下信息用于让模拟更贴近你的真实场景（全部可跳过）
        </p>
      </div>

      {/* 表单 */}
      <div className="space-y-6 rounded-2xl border border-violet-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-violet-900/30 dark:bg-slate-900/50">
        {/* 角色 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            你的角色
          </label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="选择角色..." />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 行业 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            所在行业
          </label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="选择行业..." />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 公司阶段 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            公司阶段
          </label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="选择阶段..." />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 决策偏好滑杆 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            决策偏好自评
          </label>
          <div className="px-1">
            <Slider
              value={speedBias}
              onValueChange={setSpeedBias}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-violet-600 [&_[role=slider]]:border-violet-600"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>偏速度 · 先行动再修正</span>
            <span>偏确定性 · 想清楚再行动</span>
          </div>
        </div>
      </div>

      {/* 按钮组 */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
        <Button
          onClick={handleContinue}
          size="lg"
          className="flex-1 bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          继续
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button
          onClick={handleSkip}
          variant="ghost"
          size="lg"
          className="flex-1 text-slate-500 hover:text-violet-600"
        >
          <SkipForward className="mr-1 h-4 w-4" />
          跳过，直接开始
        </Button>
      </div>

      {/* 提示 */}
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        这些信息不用于人格判定，仅用于让报告中的场景举例更贴近你的经历。
      </p>
    </div>
  );
}

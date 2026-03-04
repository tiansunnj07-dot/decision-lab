import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BrainCircuit,
  TrendingUp,
  BarChart3,
  Shield,
  Search,
  CheckCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "关于 | 甜博士决策实验室",
  description: "甜博士决策实验室的方法论、创始人背景和愿景",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          关于甜博士决策实验室
        </h1>
        <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
          用科学方法拆解决策，用实验训练判断力
        </p>
      </div>

      {/* 你是谁 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          甜博士是谁
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            甜博士（Dr. Sweet）是一位拥有商业分析与决策科学背景的实践者。
            曾在喜马拉雅负责增长与 BI 从 0 到 1 搭建、参与 CAP 认证项目、服务金融行业高管决策咨询。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            甜博士相信：<span className="font-medium text-slate-900 dark:text-white">好的决策不是天赋，而是可训练的结构能力。</span>
            决策实验室就是为此而建——让每一个决策者都能看见自己的判断路径，识别盲区，建立结构。
          </p>
        </div>
      </section>

      <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

      {/* JD5 模型 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          JD5 判断力模型
        </h2>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          甜博士基于商业决策研究提炼的五步判断力框架：
        </p>
        <div className="space-y-3">
          {[
            { key: "J1", name: "识别结构", icon: Search, desc: "识别问题的核心结构和关键变量，区分噪音和信号。" },
            { key: "J2", name: "拆解与建模", icon: BarChart3, desc: "将复杂问题拆解为可分析的子问题，建立判断框架。" },
            { key: "J3", name: "异常识别", icon: TrendingUp, desc: "识别数据或趋势中的异常信号，避免被表面指标误导。" },
            { key: "J4", name: "风险预判", icon: Shield, desc: "推演决策可能带来的下行风险和二阶效应。" },
            { key: "J5", name: "验证与退出", icon: CheckCircle, desc: "设置验证条件和退出机制，让决策可修正。" },
          ].map((step) => (
            <div
              key={step.key}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                <step.icon className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  <span className="text-violet-500">{step.key}</span> {step.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

      {/* 为什么做 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          为什么做决策实验室
        </h2>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5 dark:border-violet-900/30 dark:bg-violet-900/10">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            大多数决策失误不是因为"信息不够"，而是因为"判断路径中有盲区"。
            决策实验室通过模拟真实商业场景、识别决策人格、暴露认知陷阱，
            帮助决策者建立可复用的判断结构。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            这不是问卷，不是测评——这是一场让你"看见自己怎么想"的认知实验。
          </p>
        </div>
      </section>

      <Separator className="mb-10 bg-slate-100 dark:bg-slate-800" />

      {/* 联系方式 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          合作与联系
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">企业内训</span>
              ：为管理团队定制判断力提升训练
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">决策咨询</span>
              ：一对一判断结构诊断
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">公众号</span>
              ：甜博士爱数据爱健身
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <Link href="/lab/executive-judgment">
        <Button
          size="lg"
          className="w-full bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          体验判断力训练
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

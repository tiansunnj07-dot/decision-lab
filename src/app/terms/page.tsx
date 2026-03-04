import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

export const metadata = {
  title: "使用条款 | 甜博士",
  description: "甜博士个人站使用条款",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/50">
          <FileText className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          使用条款
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          最后更新：2026 年 3 月
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            1. 服务性质
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              甜博士决策实验室（包括判断力训练模块）是一个<strong>模拟决策系统</strong>，
              旨在通过交互式实验帮助用户了解自身的决策模式。
              本系统的分析结果仅供参考和自我探索。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            2. 非专业建议声明
          </h2>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">本网站的任何内容均不构成：</strong>
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• 专业心理咨询或心理诊断</li>
              <li>• 专业管理咨询或商业建议</li>
              <li>• 投资建议或财务规划</li>
              <li>• 人事决策依据</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              如需专业建议，请咨询相关领域的持牌专业人士。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            3. 模拟系统说明
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              实验中的"陷阱关卡"和"后果推演"是<strong>基于典型商业场景的模拟</strong>，
              不代表真实商业决策的必然结果。
              决策的实际效果受到无数变量影响，我们的模拟仅选取了有限的关键维度。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            4. 知识产权
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              本网站的所有原创内容（包括但不限于 JD5 判断力模型、决策人格框架、
              题目设计、陷阱关卡设计）均为甜博士原创，受知识产权保护。
              未经授权不得用于商业用途。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            5. 使用限制
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• 禁止将本工具用于人事筛选或录用决策</li>
              <li>• 禁止自动化抓取或批量访问</li>
              <li>• 禁止在未授权的情况下转载或传播内容</li>
            </ul>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            6. 免责声明
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              甜博士不对因使用本网站内容或实验结果而产生的任何直接或间接损失承担责任。
              使用本网站即表示你同意上述条款。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

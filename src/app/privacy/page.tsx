import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "隐私声明 | 甜博士",
  description: "甜博士个人站的数据使用与隐私保护说明",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/50">
          <ShieldCheck className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          隐私声明
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          最后更新：2026 年 3 月
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            1. 数据收集
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">我们不收集、不存储你的任何个人数据。</strong>
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• 判断力训练实验的所有计算<strong>完全在你的浏览器中完成</strong>，不会传输到服务器。</li>
              <li>• 你的答案、测试结果、人格分析报告<strong>不会被存储</strong>。</li>
              <li>• 关闭页面或刷新浏览器后，所有数据自动清除。</li>
            </ul>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            2. Cookie 与 Session
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              本网站仅使用必要的技术 Cookie（如 Next.js 框架自带的会话管理），
              不使用追踪 Cookie、广告 Cookie 或第三方分析工具。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            3. 邮箱收集
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              当前版本<strong>不收集邮箱</strong>。如果未来增加邮箱收集功能，
              将在明确告知用途并获得你的同意后才会进行。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            4. 分享功能
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              当你使用分享功能时，分享链接中仅包含你的<strong>人格类型代号</strong>（如 E、A 等）
              和置信度百分比，不包含任何具体答案或可识别个人身份的信息。
            </p>
          </div>
        </section>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            5. 联系我们
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              如果你对隐私政策有任何疑问，欢迎通过微信公众号「甜博士爱数据爱健身」联系我们。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

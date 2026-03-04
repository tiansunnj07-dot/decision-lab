import { ArticleCard } from "@/components/blog/ArticleCard";
import { posts } from "@/lib/blog/posts";
import { Database } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* 页面标题 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-900/50">
          <Database className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          甜博士大数据博客
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          用深度思考驾驭数据洪流
        </p>
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      {/* 空状态 */}
      {posts.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">文章正在酝酿中，敬请期待...</p>
        </div>
      )}
    </div>
  );
}

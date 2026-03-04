import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxBySlug, getAllMdxSlugs } from "@/lib/blog/mdx";
import { posts } from "@/lib/blog/posts";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

/* ─── 自定义 MDX 组件：为文章内容提供统一排版样式 ─── */
const mdxComponents = {
  /* 图片：圆角 + 阴影 */
  img: (props: React.ComponentProps<"img">) => (
    <span className="my-6 block overflow-hidden rounded-xl shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        alt={props.alt ?? ""}
        className="w-full"
        loading="lazy"
      />
    </span>
  ),
  /* 标题层级 */
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="mb-6 mt-10 text-3xl font-bold tracking-tight text-slate-900 dark:text-white" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mb-4 mt-8 text-2xl font-semibold text-slate-800 dark:text-slate-100" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mb-3 mt-6 text-xl font-semibold text-slate-700 dark:text-slate-200" {...props} />
  ),
  /* 段落 */
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-4 leading-7 text-slate-600 dark:text-slate-300" {...props} />
  ),
  /* 列表 */
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-slate-600 dark:text-slate-300" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-600 dark:text-slate-300" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-7" {...props} />
  ),
  /* 引用块：左边青色竖线 */
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-l-4 border-cyan-400 bg-cyan-50/50 py-3 pl-4 pr-4 italic text-slate-600 dark:border-cyan-600 dark:bg-cyan-950/30 dark:text-slate-300" {...props} />
  ),
  /* 粗体 */
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
  ),
  /* 分割线 */
  hr: () => (
    <hr className="my-8 border-slate-200 dark:border-slate-700" />
  ),
  /* 行内代码 */
  code: (props: React.ComponentProps<"code">) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-cyan-700 dark:bg-slate-800 dark:text-cyan-300" {...props} />
  ),
};

/* ─── 静态参数生成（构建时预渲染所有已有 MDX 文章） ─── */
export function generateStaticParams() {
  return getAllMdxSlugs().map((slug) => ({ slug }));
}

/* ─── 动态 Meta 信息 ─── */
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

/* ─── 博客详情页组件 ─── */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // 从 posts 列表获取元信息（标题、标签、日期等）
  const postMeta = posts.find((p) => p.slug === slug);
  // 从 MDX 文件获取正文内容
  const mdxPost = getMdxBySlug(slug);

  if (!postMeta || !mdxPost) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {/* 返回按钮 */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" />
        返回文章列表
      </Link>

      {/* 文章头部信息 */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {postMeta.title}
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          {postMeta.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1 text-sm text-slate-400 dark:text-slate-500">
            <Calendar className="h-4 w-4" />
            {postMeta.date}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-slate-400 dark:text-slate-500">
            <Clock className="h-4 w-4" />
            {postMeta.readingTime}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {postMeta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cyan-100/80 px-3 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* MDX 正文渲染 */}
      <div className="prose-custom">
        <MDXRemote source={mdxPost.content} components={mdxComponents} />
      </div>

      {/* 底部返回链接 */}
      <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-700">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" />
          返回文章列表
        </Link>
      </div>
    </article>
  );
}

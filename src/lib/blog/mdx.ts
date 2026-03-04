import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** MDX 文章的原始数据（frontmatter + 正文） */
export interface MdxPost {
  frontmatter: {
    title: string;
    date: string;
    description: string;
    tags: string[];
  };
  content: string; // 去掉 frontmatter 后的 MDX 正文
}

/** 内容目录路径 */
const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * 根据 slug 读取对应的 .mdx 文件
 * 文件路径：src/content/blog/{slug}.mdx
 */
export function getMdxBySlug(slug: string): MdxPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: {
      title: data.title ?? "",
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
    },
    content,
  };
}

/**
 * 列出所有可用的 MDX 文章 slug（用于 generateStaticParams）
 */
export function getAllMdxSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

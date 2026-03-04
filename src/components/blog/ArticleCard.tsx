import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog/posts";

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-cyan-300 dark:hover:border-cyan-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
            {post.title}
          </CardTitle>
          <CardDescription className="text-base">
            {post.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-100/80 px-2.5 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 transition-all duration-300 group-hover:gap-2 dark:text-cyan-400">
            阅读
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

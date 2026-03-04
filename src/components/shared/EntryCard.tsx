import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** 颜色方案配置 */
const colorSchemes = {
  violet: {
    border: "border-violet-200/60 dark:border-violet-800/40",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-600",
    bg: "bg-gradient-to-br from-white to-violet-50/50 dark:from-slate-900 dark:to-violet-950/30",
    shadow: "hover:shadow-violet-200/40 dark:hover:shadow-violet-900/30",
    glow1: "bg-violet-400/10 group-hover:bg-violet-400/20",
    glow2: "bg-fuchsia-400/10 group-hover:bg-fuchsia-400/15",
    iconBg: "bg-violet-100 group-hover:bg-violet-200 dark:bg-violet-900/50 dark:group-hover:bg-violet-800/70",
    iconColor: "text-violet-600 dark:text-violet-400",
    tag: "bg-violet-100/80 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    action: "text-violet-600 dark:text-violet-400",
  },
  cyan: {
    border: "border-cyan-200/60 dark:border-cyan-800/40",
    borderHover: "hover:border-cyan-300 dark:hover:border-cyan-600",
    bg: "bg-gradient-to-br from-white to-cyan-50/50 dark:from-slate-900 dark:to-cyan-950/30",
    shadow: "hover:shadow-cyan-200/40 dark:hover:shadow-cyan-900/30",
    glow1: "bg-cyan-400/10 group-hover:bg-cyan-400/20",
    glow2: "bg-teal-400/10 group-hover:bg-teal-400/15",
    iconBg: "bg-cyan-100 group-hover:bg-cyan-200 dark:bg-cyan-900/50 dark:group-hover:bg-cyan-800/70",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    tag: "bg-cyan-100/80 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    action: "text-cyan-600 dark:text-cyan-400",
  },
} as const;

type ColorScheme = keyof typeof colorSchemes;

interface EntryCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  actionText: string;
  colorScheme: ColorScheme;
}

export function EntryCard({
  href,
  icon: Icon,
  title,
  subtitle,
  description,
  tags,
  actionText,
  colorScheme,
}: EntryCardProps) {
  const c = colorSchemes[colorScheme];

  return (
    <Link href={href} className="group block">
      <Card
        className={cn(
          "relative h-full min-h-[360px] cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl",
          c.border,
          c.borderHover,
          c.bg,
          c.shadow
        )}
      >
        {/* 装饰光晕 */}
        <div
          className={cn(
            "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150",
            c.glow1
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full blur-2xl transition-all duration-500",
            c.glow2
          )}
        />

        <CardHeader className="pb-2">
          <div
            className={cn(
              "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300",
              c.iconBg
            )}
          >
            <Icon className={cn("h-7 w-7", c.iconColor)} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-slate-500 dark:text-slate-400">
            {subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  c.tag
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-3",
              c.action
            )}
          >
            {actionText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

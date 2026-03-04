import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Experiment } from "@/lib/lab/experiments";
import { cn } from "@/lib/utils";

interface ExperimentCardProps {
  experiment: Experiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const isLive = experiment.status === "live";

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isLive
          ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600"
          : "opacity-75"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            {experiment.title}
          </CardTitle>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              isLive
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            )}
          >
            {isLive ? "可体验" : "即将上线"}
          </span>
        </div>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {experiment.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-violet-100/80 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

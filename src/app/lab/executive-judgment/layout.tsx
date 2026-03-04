import { ExperimentProvider } from "@/components/lab/executive-judgment/ExperimentProvider";

export const metadata = {
  title: "高管判断力训练",
  description: "面向高管的认知偏差识别与决策力提升训练",
};

export default function ExecutiveJudgmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExperimentProvider>{children}</ExperimentProvider>;
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SparklineChart } from "@/components/charts";

export function StatTrendCard({
  title,
  meta,
  data,
  color,
}: {
  title: string;
  meta?: string;
  data: number[];
  color: "primary" | "success" | "premium";
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      </CardHeader>
      <CardContent className="pt-4">
        <SparklineChart data={data} color={color} height={120} />
      </CardContent>
    </Card>
  );
}

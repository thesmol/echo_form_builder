import { Suspense } from "react";
import CardStatsWrapper, { StatsCards } from "@/components/CardStatsWrapper";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense
        fallback={<StatsCards loading={true} />}
      >
        <CardStatsWrapper />
      </Suspense>

      <Separator className="my-6"/>
    </div>
  );
}

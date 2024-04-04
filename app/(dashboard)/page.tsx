import { Suspense } from "react";
import CardStatsWrapper, { StatsCards } from "@/components/CardStatsWrapper";

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense
        fallback={<StatsCards loading={true} />}
      >
        <CardStatsWrapper />
      </Suspense>
    </div>
  );
}

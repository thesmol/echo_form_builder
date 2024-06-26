import CardStatsWrapper, { StatsCards } from "@/components/statsCards/CardStatsWrapper";
import CreateFormBtn from "@/components/formCards/CreateFormBtn";
import FormCards from "@/components/formCards/FormCards";
import FormCardsSkeleton from "@/components/formCards/FormCardsSkeleton";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { FormProvider } from "@/components/providers/FormProvider";

export default function Home() {
  return (
    <FormProvider>
      <div className="container pt-4">
        <Suspense
          fallback={<StatsCards loading={true} />}
        >
          <CardStatsWrapper />
        </Suspense>

        <Separator className="my-6" />
        <h2 className="text-4xl font-bold col-span-2">Ваши формы</h2>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
          <CreateFormBtn />
          <Suspense
            fallback={[1, 2, 3, 4, 5].map(el => <FormCardsSkeleton key={el} />)}
          >
            <FormCards />
          </Suspense>
        </div>
      </div>
    </FormProvider>

  );
}

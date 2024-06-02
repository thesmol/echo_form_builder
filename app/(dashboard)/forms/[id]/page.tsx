import { GetFormById } from '@/actions/form';
import FormLinkShare from '@/components/formDetails/FormLinkShare';
import SubmissionsTable from '@/components/formDetails/SubmissionsTable';
import VisitBtn from '@/components/formDetails/VisitBtn';
import { StatsCards } from '@/components/statsCards/CardStatsWrapper';
import React from 'react'

async function FormDetailPage({ params }: {
    params: {
        id: string;
    }
}) {
    const { id } = params;
    const form = await GetFormById(Number(id));

    if (!form) {
        throw new Error("Форма не найдена");
    }

    const { visits, submissions } = form;
    
    let submissionRate = 0;
    let  bounceRate = 0;
    
    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
        bounceRate = 100 - submissionRate;
    }

    const formStats = {
        visits,
        submissions,
        submissionRate,
        bounceRate
    };
    
    return (
        <>
            <div className="py-10 border-b border-muted">
                <div className="flex justify-between container">
                    <h1 className="text-4xl font-bold truncate">
                        {form.name}
                    </h1>
                    <VisitBtn shareUrl={form.shareURL} />
                </div>
            </div>
            <div className="py-4 border-b border-muted">
                <div className="container flex gap-2 items-center justify-between">
                    <FormLinkShare shareUrl={form.shareURL} />
                </div>
            </div>
            <div className="container">
                <StatsCards 
                    data = {formStats}
                    loading = {false}
                />
            </div>

            <div className="container pt-10">
                <SubmissionsTable id = {form.id}/>
            </div>
        </>
    )
}

export default FormDetailPage;
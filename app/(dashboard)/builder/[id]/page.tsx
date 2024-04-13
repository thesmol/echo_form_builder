import { GetFormById } from '@/actions/form';
import FormBuilder from '@/components/builder/FormBuilder';
import DesignerProvider from '@/components/providers/DesignerProvider';
import React from 'react'

async function BuilderPage({ params }: {
    params: {
        id: string;
    }
}) {
    const { id } = params;
    const form = await GetFormById(Number(id));

    if (!form) {
        throw new Error("Форма не найдена");
    }

    return (
        <DesignerProvider>
            <FormBuilder form={form} />
        </DesignerProvider>

    )
}

export default BuilderPage
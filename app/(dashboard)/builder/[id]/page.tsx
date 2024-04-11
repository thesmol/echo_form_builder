import { GetFormById } from '@/actions/form';
import FormBuilder from '@/components/builder/FormBuilder';
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
        <FormBuilder form={form}/>
    )
}

export default BuilderPage
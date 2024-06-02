import { GetFormContentByUrl } from '@/actions/form';
import FormSubmitComponent from '@/components/submitForm/FormSubmitComponent';
import { FormElementInstance } from '@/types/types';
import React from 'react'

async function SubmitPage({
    params,
}: {
    params: {
        formUrl: string
    }
}) {

    const form = await GetFormContentByUrl(params.formUrl);

    if (!form) {
        throw new Error("form not found");
    }

    const formContent = JSON.parse(form.content) as FormElementInstance[];

    return (
        <FormSubmitComponent content={formContent} formUrl = {params.formUrl}/>
    )
}

export default SubmitPage
"use client"

import React, { useContext } from 'react'
import FormCard from './FormCard';
import { FormContext } from '../providers/FormProvider';

function FormCards() {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('FormCards must be used within a FormProvider');
    }

    const { forms } = context;

    return (
        <>
            {forms.map(form => (
                <FormCard 
                    key = {form.id}
                    form = {form}
                />
            ))}
        </>
    )
}

export default FormCards
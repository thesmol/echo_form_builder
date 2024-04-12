"use client"

import * as React from "react"
import { GetForms } from '@/actions/form'
import { Form } from "@prisma/client"
import { createContext, useEffect, useState } from 'react'

export const FormContext = createContext<{ forms: Form[]; setForms: React.Dispatch<React.SetStateAction<Form[]>> } | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
    const [forms, setForms] = useState<Form[]>([]);

    useEffect(() => {
        async function fetchForms() {
            const forms = await GetForms();
            setForms(forms);
        }

        fetchForms();
    }, []);

    return (
        <FormContext.Provider value={{ forms, setForms }}>
            {children}
        </FormContext.Provider>
    );
}
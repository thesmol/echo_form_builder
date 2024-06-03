"use client"

import { FormElementInstance } from '@/types/types'
import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElements } from '../builder/FormElements'
import { Button } from '../ui/button'
import { HiCursorClick } from 'react-icons/hi'
import { toast } from '../ui/use-toast'
import { ImSpinner10 } from 'react-icons/im'
import { SubmitForm } from '@/actions/form'
import Confetti from "react-confetti"

function FormSubmitComponent({
    content,
    formUrl
}: {
    content: FormElementInstance[],
    formUrl: string
}) {
    const formValues = useRef<{ [key: string]: string }>({});
    const formErrors = useRef<{ [key: string]: boolean }>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime());

    const [submitted, setSubmitted] = useState(false);
    const [pending, startTransition] = useTransition();

    const submitValue = (key: string, value: string) => {
        formValues.current[key] = value;
    }

    const validateForm: () => boolean = useCallback(() => {
        for (const field of content) {
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, actualValue);

            if (!valid) {
                formErrors.current[field.id] = true;
            }
        }

        if (Object.keys(formErrors.current).length > 0) {
            return false;
        }

        return true;
    }, [content]);

    const submitForm = async () => {
        formErrors.current = {};
        const validForm = validateForm();

        if (!validForm) {
            setRenderKey(new Date().getTime());
            toast({
                title: "Ошибка",
                description: "Пожалуйста, проверьте заполнение формы на ошибки",
                variant: "destructive",
            })
            return;
        }

        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formUrl, jsonContent);
            setSubmitted(true);
            toast({
                title: "Отправлено",
                description: "Ваш ответ был сохранен и отправлен!",
            })
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Что-то пошло не так",
                variant: "destructive",
            })
        }
    }

    if (submitted) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="flex justify-center w-full h-full items-center p-8">
                    <div key={renderKey} className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-[#3730a3] rounded-xl">
                        <h1 className="text-2xl font-bold">
                            Ответы сохранены
                        </h1>
                        <p className="text-muted-foreground">
                            Спасибо за заполнение формы, Вы можете закрыть эту страницу
                        </p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="flex justify-center w-full h-full items-start p-8 overflow-y-auto">
            <div key={renderKey} className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded-xl">
                {content.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return (
                        <FormElement
                            key={element.id}
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formErrors.current[element.id]}
                            defaultValue={formValues.current[element.id]}
                        />)
                })}
                <Button
                    className='mt-8'
                    onClick={() => startTransition(submitForm)}
                    disabled={pending}
                >
                    {!pending && <>
                        <HiCursorClick className='mr-2' />
                        Отправить
                    </>}
                    {pending && <>
                        <ImSpinner10 className='animate-spin' />
                    </>}
                </Button>
            </div>
        </div>
    )
}

export default FormSubmitComponent;
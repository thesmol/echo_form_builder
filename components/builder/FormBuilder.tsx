"use client"

import { Form } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
    PreviewDialogBtn,
    SaveFormBtn,
    PublishFormBtn
} from '../builderNavButtons/builderButtons'
import Designer from './Designer'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import DragOverlayWrapper from './DragOverlayWrapper'
import useDesigner from '@/hooks/useDesigner'
import { ImSpinner10 } from 'react-icons/im'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'
import Link from 'next/link'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Confetti from "react-confetti"

function FormBuilder({ form }: { form: Form }) {
    const { setElements } = useDesigner();
    const [isReady, setIsReady] = useState(false);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10, // 10px
        }
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300, // 300ms
            tolerance: 5 // 5px
        }
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        if (isReady) return;
        const elements = JSON.parse(form.content);
        setElements(elements);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);

        return () => clearTimeout(readyTimeout);
    }, [form, setElements, isReady]);

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <ImSpinner10 className='animate-spin h-12 w-12' />
            </div>
        )
    }

    const shareUrl = `${window.location.origin}/submit/${form.shareURL}`

    if (form.published) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className='border-[1px] rounded-xl p-10 m-10 shadow-2xl shadow-green-700 max-w-min'>
                        <h1 className="text-center text-2xl font-bold text-primary border-b pb-2 mb-10 text-nowrap">
                            🎊🎊Форма опубликована🎊🎊
                        </h1>
                        <h2 className="text-xl">Поделитесь этой формой</h2>
                        <h3 className="text-l text-muted-foreground border-b pb-10">
                            Все у кого есть ссылка могут просматривать и заполнять эту форму
                        </h3>
                        <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                            <Input className='w-full' readOnly value={shareUrl} />
                            <Button
                                className='mt-2 w-full'
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({
                                        title: "Скопировано",
                                        description: "Ссылка скопирирована в буфер обмена"
                                    })
                                }}
                            >Скопировать ссылку</Button>
                        </div>
                        <div className="flex justify-between">
                            <Button variant={"link"} asChild className='p-0'>
                                <Link href={"/"} className='gap-2'>
                                    <BsArrowLeft />
                                    Вернуться на главную
                                </Link>
                            </Button>
                            <Button variant={"link"} asChild className='p-0'>
                                <Link href={`/forms/${form.id}`} className='gap-2'>
                                    Детали формы
                                    <BsArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <DndContext sensors={sensors}>
            <main className='flex flex-col w-full'>
                <nav className="flex justify-between items-center border-b-2 p-4 gap-3">
                    <h2 className='truncate font-medium'>
                        <span className='text-muted-foreground mr-2'> Форма:</span>
                        {form.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <PreviewDialogBtn />
                        {!form.published && (
                            <>
                                <SaveFormBtn id={form.id} />
                                <PublishFormBtn id={form.id} />
                            </>
                        )}
                    </div>
                </nav>
                <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    )
}

export default FormBuilder
"use client"

import { Form } from '@prisma/client'
import React from 'react'
import {
    PreviewDialogBtn,
    SaveFormBtn,
    PublishFormBtn
} from '../builderNavButtons/builderButtons'
import Designer from './Designer'
import { DndContext } from '@dnd-kit/core'
import DragOverlayWrapper from './DragOverlayWrapper'

function FormBuilder({ form }: { form: Form }) {
    return (
        <DndContext>
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
                                <SaveFormBtn />
                                <PublishFormBtn />
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
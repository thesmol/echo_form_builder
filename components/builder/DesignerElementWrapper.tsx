import { FormElementInstance } from '@/types/types'
import React, { useState } from 'react'
import { FormElements } from './FormElements'
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { Button } from '../ui/button'
import { BiSolidTrashAlt } from 'react-icons/bi'
import useDesigner from '@/hooks/useDesigner'
import { cn } from '@/lib/utils'

function DesignerElementWrapper({ element }: {
    element: FormElementInstance
}) {
    const {
        removeElement,
        selectedElement,
        setSelectedElement
    } = useDesigner();

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

    // prevent double hover effects
    useDndMonitor({
        onDragStart: () => {
            setMouseIsOver(false);
        }
    })

    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true
        }
    })

    const bottomHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true
        }
    })

    const draggable = useDraggable({
        id: element.id + "-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true
        }
    })

    if (draggable.isDragging) return null;

    const DesignerElement = FormElements[element.type].designerComponent;
    return (
        <div
            className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
            onClick={(event)=>{
                event.stopPropagation();
                setSelectedElement(element)
            }}
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <div
                ref={topHalf.setNodeRef}
                className="absolute w-full h-1/2 rounded-t-md"
            />
            <div
                ref={bottomHalf.setNodeRef}
                className="absolute w-full h-1/2 rounded-b-md bottom-0"
            />

            {topHalf.isOver && (
                <div className='absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-primary' />
            )}
            <div className={cn(
                'flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100',
                mouseIsOver && "opacity-30",
            )}>
                <DesignerElement elementInstance={element} />
            </div>
            {bottomHalf.isOver && (
                <div className='absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-primary' />
            )}

            {mouseIsOver && (
                <>
                    <div className="absolute right-0 h-full">
                        <Button
                            className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500'
                            variant={"outline"}
                            onClick={(event) => {
                                event.stopPropagation(); // avoid selection of element while deleting
                                removeElement(element.id);
                            }}
                        >
                            <BiSolidTrashAlt className='h-6 w-6' />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                        <p className='text-muted-foregroud text-sm lg:text-nowrap'>
                            Нажмите для свойств или перетащите чтобы передвинуть
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default DesignerElementWrapper
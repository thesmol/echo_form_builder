"use client"

import React from 'react'
import DesignerSidebar from './DesignerSidebar'
import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import useDesigner from '@/hooks/useDesigner'
import { FormElements } from './FormElements'
import { ElementsType } from '@/types/types'
import { idGenerator } from '@/lib/idGenerator'
import DesignerElementWrapper from './DesignerElementWrapper'

function Designer() {
    const {
        elements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement
    } = useDesigner();

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true,
        }
    })

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over } = event;
            if (!active || !over) return;

            // The first case: dropping a sidebar element over the designer drop-zone-area
            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

            const droppingSidebarBtnOverDesignerDropArea =
                isDesignerBtnElement &&
                isDroppingOverDesignerDropArea;

            if (droppingSidebarBtnOverDesignerDropArea) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                addElement(elements.length, newElement);
                return;
            }

            // The second case: dropping a sidebar element over the designer element
            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;

            const isDroppingOverDesignerElement =
                isDroppingOverDesignerElementTopHalf ||
                isDroppingOverDesignerElementBottomHalf;

            const droppingSidebarBtnOverDesignerElement =
                isDesignerBtnElement &&
                isDroppingOverDesignerElement;

            if (droppingSidebarBtnOverDesignerElement) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                const overId = over.data?.current?.elementId;

                const overElementIndex = elements.findIndex(el => el.id === overId);
                if (overElementIndex === -1) {
                    throw new Error("element not found");
                }

                let indexForNewElement = overElementIndex; // on top half
                if (isDroppingOverDesignerElementBottomHalf) {
                    // if not top half
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, newElement);
                return;
            }

            // The third case: dropping the designer element over the designer element
            const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

            const draggingDesignerElementOverDesignerElement =
                isDroppingOverDesignerElement &&
                isDraggingDesignerElement;

            if (draggingDesignerElementOverDesignerElement) {
                const activeId = active.data?.current?.elementId;
                const overId = over.data?.current?.elementId;

                const activeElementIndex = elements.findIndex(el => el.id === activeId);
                const overElementIndex = elements.findIndex(el => el.id === overId);

                if (activeElementIndex === -1 || overElementIndex === -1) {
                    throw new Error("element not found");
                }

                const activeElement = { ...elements[activeElementIndex] };

                removeElement(activeId);

                let indexForNewElement = overElementIndex; // on top half
                if (isDroppingOverDesignerElementBottomHalf) {
                    // if not top half
                    indexForNewElement = overElementIndex + 1;
                }
                addElement(indexForNewElement, activeElement);
                return;
            }
        },
    });

    return (
        <div className='flex w-full h-full'>
            <div className="p-4 w-full"
                onClick={() => {
                    if (selectedElement) setSelectedElement(null);
                }}>
                <div
                    ref={droppable.setNodeRef}
                    className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
                        droppable.isOver && "ring-4 ring-primary ring-inset"
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className='text-3xl text-muted-foreground flex flex-grow items-center font-bold'>
                            Перетащите сюда
                        </p>
                    )}
                    {droppable.isOver && elements.length === 0 && (
                        <div className="p-4 w-full">
                            <div className="h-[120px] rounded-md bg-primary/20"></div>
                        </div>
                    )}
                    {elements.length > 0 && (
                        <div className='flex flex-col w-full gap-2 p-4'>
                            {elements.map(element => (
                                <DesignerElementWrapper
                                    key={element.id}
                                    element={element}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    )
}

export default Designer
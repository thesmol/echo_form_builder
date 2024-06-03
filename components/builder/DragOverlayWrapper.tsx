import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement';
import { FormElements } from './FormElements';
import { ElementsType } from '@/types/types';
import useDesigner from '@/hooks/useDesigner';

function DragOverlayWrapper() {
    const { elements } = useDesigner();
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);

    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active);
        },
        onDragCancel: () => {
            setDraggedItem(null);
        },
        onDragEnd: () => {
            setDraggedItem(null);
        }
    })

    if (!draggedItem) return null;

    let node = <div>no drag overlay</div>

    const isSidebarBtnElemet = draggedItem.data?.current?.isDesignerBtnElement;
    if (isSidebarBtnElemet) {
        const type = draggedItem.data?.current?.type as ElementsType;
        node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
    }

    const idDesignerElement = draggedItem.data?.current?.isDesignerElement;
    if (idDesignerElement) {
        const elementId = draggedItem.data?.current?.elementId;
        const element = elements.find(el => el.id === elementId);

        if (!element) node = <div>Element not found</div>;
        else {
            const DesignerElementComponent = FormElements[element.type].designerComponent;
            node = (
                <div className='flex w-full h-fit min-h-[120px] items-center rounded-md bg-accent px-4 py-2 pointer-events-none opacity-80'>
                    <DesignerElementComponent elementInstance={element} />
                </div>
            )
        }
    }

    return (
        <DragOverlay>
            {node}
        </DragOverlay>
    )
}

export default DragOverlayWrapper
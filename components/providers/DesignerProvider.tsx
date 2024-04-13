"use client"

import React, { ReactNode, useState, createContext } from 'react'
import { DesignerContextType, FormElementInstance } from "@/types/types"

export const DesignerContext = createContext<DesignerContextType | null>(null);

function DesignerProvider({ children }: {
    children: ReactNode
}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const addElement = (index: number, element: FormElementInstance) => {
        setElements(prev => {
            const newElements = [...prev];
            newElements.splice(index, 0, element);
            return newElements;
        })
    }

    const removeElement = (id: string) => {
        setElements(prev => prev.filter(element => element.id !== id));
    }

    return (
        <DesignerContext.Provider value={{
            elements,
            addElement,
            removeElement
        }}>
            {children}
        </DesignerContext.Provider>
    )
}

export default DesignerProvider
"use client"

import { useContext } from 'react'
import { DesignerContext } from '../components/providers/DesignerProvider';

function useDesigner() {
    const contex = useContext(DesignerContext);
    
    if (!contex) {
        throw new Error("useDesigner должен использоваться через DesignerContext")
    }

    return contex;
}

export default useDesigner
"use client"

import { ElementsType, FormElement } from "@/types/types"
import { MdTextFields } from "react-icons/md";

const type: ElementsType = "TextField";

export const TextFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttributes: {
            label: "Текстовое поле",
            helperText: "Подсказка",
            required: false,
            placeHolder: "Значение тут"
        }
    }),

    designerBtnElement: {
        icon: MdTextFields,
        label: "Текстовое поле"
    },
    designerComponent: () => <div>designerComponent</div>,
    formComponent: () => <div>formComponent</div>,
    propertiesComponent: () => <div>propertiesComponent</div>,
}

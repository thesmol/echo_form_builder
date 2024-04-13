"use client"

import { ElementsType, FormElement, FormElementInstance } from "@/types/types"
import { Label } from "@radix-ui/react-label";
import { MdTextFields } from "react-icons/md";
import { Input } from "../ui/input";

const type: ElementsType = "TextField";

const extraAttributes = {
    label: "Текстовое поле",
    helperText: "Заполните текстовое поле",
    required: false,
    placeholder: "Текстовое значение тут..."
}

export type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export const TextFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: MdTextFields,
        label: "Текстовое поле"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
}

function DesignerComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { label, required, placeholder, helperText } = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Input
                readOnly
                disabled
                placeholder={placeholder}
            />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">
                    {helperText}
                </p>
            )}
        </div>
    )
}

function FormComponent() {
    return (
        <div>

        </div>
    )
}

function PropertiesComponent() {
    return (
        <div>

        </div>
    )
}

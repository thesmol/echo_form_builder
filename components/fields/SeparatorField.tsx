"use client"

import {
    ElementsType,
    FormElement,
    FormElementInstance,
} from "@/types/types";
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type
    }),

    designerBtnElement: {
        icon: RiSeparator,
        label: "Разделитель"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}

function DesignerComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">
                Разделитель
            </Label>
            <Separator />
        </div>
    )
}

function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
}) {
    return (
        <Separator className="my-3" />
    )
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
}) {
    return <p>Для этого элемента нет свойств</p>
}

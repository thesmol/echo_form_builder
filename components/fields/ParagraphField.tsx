"use client"

import {
    ElementsType,
    FormElement,
    FormElementInstance,
} from "@/types/types";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";

const extraAttributes = {
    text: "Текст параграфа",
}

const propertiesSchema = z.object({
    text: z
        .string()
        .min(2, "Параграф должен содержать как минимум 2 символа")
        .max(1000, "Параграф может содержать максимум 1000 символов"),
})

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const ParagraphFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: BsTextParagraph,
        label: "Параграф"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}

function DesignerComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { text } = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">
                Параграф
            </Label>
            <p>{text}</p>
        </div>
    )
}

function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
}) {
    const element = elementInstance as CustomInstance;
    const { text } = element.extraAttributes;

    return (
        <p>
            {text}
        </p>
    )
}

function PropertiesComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner();

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            text: element.extraAttributes.title,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        const { text } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                text,
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                className="space-y-3"
                onSubmit={e => { e.preventDefault() }}
            >
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Параграф
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="h-[250px]"
                                    {...field}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => {
                                        applyChanges({text: e.currentTarget.value})
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

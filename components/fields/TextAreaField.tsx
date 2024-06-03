"use client"

import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitFunction
} from "@/types/types";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "@/hooks/useDesigner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { BsTextareaResize } from "react-icons/bs";
import { Slider } from "../ui/slider";

const type: ElementsType = "TextAreaField";

const extraAttributes = {
    label: "Текстовая область",
    helperText: "Заполните текстовую область",
    required: false,
    placeholder: "Текстовое значение тут...",
    rows: 3,
}

const propertiesSchema = z.object({
    label: z.string().min(2, "Поле должно содержать как минимум 2 символа").max(80, "Поле может содержать максимум 80 символов"),
    helperText: z.string().max(300, "Поле может содержать максимум 300 символов"),
    required: z.boolean().default(false),
    placeholder: z.string().max(80, "Поле может содержать максимум 80 символов"),
    rows: z.number().min(1, "Количество строк не может быть меньше 1").max(30, "Количество строк не может быть больше 10"),
})

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const TextAreaFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: BsTextareaResize,
        label: "Текстовая область"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (
        formElement: FormElementInstance,
        currentValue: string
    ): boolean => {
        const element = formElement as CustomInstance;

        if (element.extraAttributes.required) {
            return currentValue.length > 0;
        }

        return true;
    }
}

function DesignerComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { label, required, placeholder, helperText, rows } = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Textarea
                readOnly
                disabled
                placeholder={placeholder}
                rows={rows}
            />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">
                    {helperText}
                </p>
            )}
        </div>
    )
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}: {
    elementInstance: FormElementInstance,
    submitValue?: SubmitFunction,
    isInvalid?: boolean,
    defaultValue?: string,
}) {
    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);

    const element = elementInstance as CustomInstance;

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid])


    const { label, required, placeholder, helperText, rows } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && " *"}
            </Label>
            <Textarea
                rows={rows}
                className={cn(error && "border-red-500")}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => {
                    if (!submitValue) return;

                    const valid = TextAreaFieldFormElement.validate(element, e.target.value);
                    setError(!valid);
                    if (!valid) return;

                    submitValue(element.id, e.target.value)
                }}
                value={value}
                placeholder={placeholder}
            />
            {helperText && (
                <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>
                    {helperText}
                </p>
            )}
        </div>
    )
}

function PropertiesComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner();

    const { label, required, placeholder, helperText, rows } = element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: label,
            helperText: helperText,
            placeholder: placeholder,
            required: required,
            rows: rows,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        const { label, required, placeholder, helperText, rows } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                placeholder,
                required,
                rows,
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
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Заголовок
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => {
                                        applyChanges(form.getValues())
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Заголовок поля, <br /> который будет отображен сверху
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Замещающий текст
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => {
                                        applyChanges(form.getValues())
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Текст, который будет<br />отображен внутри поля
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Подсказка
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows = {4}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => {
                                        applyChanges(form.getValues())
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Текст, который будет, <br /> отображен ниже поля
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rows"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Количество строк {form.watch("rows")}
                            </FormLabel>
                            <FormControl className="pt-2">
                                <Slider
                                    defaultValue={[field.value]}
                                    min={1}
                                    max={30}
                                    step={1}
                                    onValueChange={(value) => {
                                        applyChanges(form.getValues())
                                        field.onChange(value[0])
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Количество строк <br /> для текстовой области
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>
                                    Обязательное поле
                                </FormLabel>
                                <FormDescription>
                                    Определение того <br /> является ли поле обязательным для заполнения
                                </FormDescription>
                            </div>
                            <FormControl className="ml-3">
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
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

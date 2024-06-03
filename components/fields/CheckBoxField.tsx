"use client"

import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitFunction
} from "@/types/types";
import { IoMdCheckbox } from "react-icons/io";
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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const type: ElementsType = "CheckBoxField";

const extraAttributes = {
    label: "Чекбокс",
    helperText: "Отметье чекбокс",
    required: false,
}

const propertiesSchema = z.object({
    label: z.string().min(2, "Поле подписи должно содержать как минимум 2 символа").max(80, "Поле может содержать максимум 80 символов"),
    helperText: z.string().max(300, "Поле подсказки может содержать максимум 300 символов"),
    required: z.boolean().default(false),
})

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const CheckBoxFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: IoMdCheckbox,
        label: "Чекбокс"
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
            return currentValue === "true";
        }

        return true;
    }
}

function DesignerComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { label, required, helperText } = element.extraAttributes;
    const id = `check-box-${element.id}`;

    return (
        <div className="flex items-top space-x-2">
            <Checkbox id={id} />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className="text-muted-foreground text-[0.8rem]">
                        {helperText}
                    </p>
                )}
            </div>
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
    const [value, setValue] = useState<boolean>(defaultValue === "true" ? true : false);
    const [error, setError] = useState(false);

    const element = elementInstance as CustomInstance;

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid])

    const { label, required, helperText } = element.extraAttributes;
    const id = `check-box-${element.id}`;

    return (
        <div className="flex items-top space-x-2">
            <Checkbox id={id} checked={value}
                className={cn(error && "border-red-500")}
                onCheckedChange={(checked) => {
                    let value = false;
                    if (checked === true) value = true;

                    setValue(value);
                    if (!submitValue) return;

                    const stringValue = value ? "true" : "false";

                    const valid = CheckBoxFieldFormElement.validate(
                        element,
                        stringValue
                    );

                    setError(!valid);
                    submitValue(element.id, stringValue);
                }}
            />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id} className={cn(error && "text-red-500")}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className={cn("text-muted-foreground text-[0.8rem]",
                        error &&  "text-red-500"
                    )}>
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    )
}

function PropertiesComponent({ elementInstance }: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner();

    const { label, required, placeholder, helperText } = element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: label,
            helperText: helperText,
            required: required,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        const { label, required, helperText } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                placeholder,
                required,
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
                    name="helperText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Подсказка
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={4}
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

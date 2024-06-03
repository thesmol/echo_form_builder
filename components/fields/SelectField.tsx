"use client"

import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitFunction
} from "@/types/types";
import { Label } from "@radix-ui/react-label";
import { RxDropdownMenu } from "react-icons/rx";
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
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { toast } from "../ui/use-toast";

const type: ElementsType = "SelectField";

const extraAttributes = {
    label: "Выбор из списка",
    helperText: "Выберите элемент из списка доступных",
    required: false,
    placeholder: "Элемент",
    options: []
}

const propertiesSchema = z.object({
    label: z.string().min(2, "Поле должно содержать как минимум 2 символа").max(80, "Поле может содержать максимум 80 символов"),
    helperText: z.string().max(300, "Поле может содержать максимум 300 символов"),
    required: z.boolean().default(false),
    placeholder: z.string().max(80, "Поле может содержать максимум 80 символов"),
    options: z.array(z.string()).default([]),
})

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const SelectFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: RxDropdownMenu,
        label: "Выбор из списка"
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
    const { label, required, placeholder, helperText } = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </Select>
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


    const { label, required, placeholder, helperText, options } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && " *"}
            </Label>
            <Select
                defaultValue={value}
                onValueChange={(value) => {
                    setValue(value);
                    if (!submitValue) return;

                    const valid = SelectFieldFormElement.validate(element, value);
                    setError(!valid);
                    submitValue(element.id, value);
                }}>
                <SelectTrigger className={cn("w-full",
                    error && "border-red-500"
                )}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={`${index}-${option}`} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
    const { updateElement, setSelectedElement } = useDesigner();

    const { label, required, placeholder, helperText, options } = element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onSubmit",
        defaultValues: {
            label: label,
            helperText: helperText,
            placeholder: placeholder,
            required: required,
            options: options
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        const { label, required, placeholder, helperText, options } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                placeholder,
                required,
                options
            }
        });

        toast({
            title: "Успех",
            description: "Свойства успешно сохранены"
        });

        setSelectedElement(null);
    }

    const [optionCounter, setOptionCounter] = useState<string>("");
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(applyChanges)}
                className="space-y-3"
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
                                    rows={4}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => {
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
                <Separator />
                <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel> Опции </FormLabel>
                                <Button
                                    variant={"outline"}
                                    className="gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue("options", field.value.concat("Новая опция " + optionCounter));
                                        setOptionCounter(optionCounter + " ");
                                    }}
                                >
                                    <AiOutlinePlus />
                                    Добавить опцию
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {form.watch("options").map((option, index) => (
                                    <div key={index} className="flex justify-between items-center gap-1">
                                        <Input
                                            placeholder=""
                                            value={option}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => {
                                                field.value[index] = e.target.value;
                                                field.onChange(field.value)
                                            }} />
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const newOptions = [...field.value];
                                                newOptions.splice(index, 1);
                                                field.onChange(newOptions);
                                            }}
                                        >
                                            <AiOutlineClose />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormDescription>
                                Текст, который будет, <br /> отображен ниже поля
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
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
                <Separator />
                <Button className="w-full" type="submit">
                    Сохранить
                </Button>
            </form>
        </Form>
    )
}

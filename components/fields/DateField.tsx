"use client"

import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitFunction
} from "@/types/types";
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
import { BsFillCalendarDateFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { ru } from "date-fns/locale";
import { Label } from "../ui/label";

const type: ElementsType = "DateField";

const extraAttributes = {
    label: "Поле даты",
    helperText: "Выберите дату",
    required: false,
}

const propertiesSchema = z.object({
    label: z.string().min(2, "Поле должно содержать как минимум 2 символа").max(80, "Поле может содержать максимум 80 символов"),
    helperText: z.string().max(300, "Поле может содержать максимум 300 символов"),
    required: z.boolean().default(false),
})

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const DateFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: BsFillCalendarDateFill,
        label: "Дата"
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
    const { label, required, helperText } = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Button variant={"outline"} className="justify-start w-full text-left font-normal items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Выберите дату</span>
            </Button>
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

    const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined);
    const [error, setError] = useState(false);

    const element = elementInstance as CustomInstance;

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid])


    const { label, required, helperText } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && " *"}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", {
                            locale: ru
                        }) : <span>Выберите дату</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        locale={ru}
                        selected={date}
                        onSelect={(date) => {
                            setDate(date);

                            if (!submitValue) return;
                            const value = date?.toUTCString() || "";
                            const valid = DateFieldFormElement.validate(element, value);
                            setError(!valid);
                            submitValue(element.id, value);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
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

    const { label, required, helperText } = element.extraAttributes;
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

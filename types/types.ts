import { GetFormStats } from "@/actions/form";
import { formSchemaType } from "@/schemas/form";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

export interface IStatsCardProps {
    title: string,
    icon: ReactNode,
    helperText: string,
    value: string,
    loading: boolean,
    className: string
}

export interface IStatsCardsProps {
    data?: Awaited<ReturnType<typeof GetFormStats>>;
    loading: boolean;
}

export interface IFormStats {
    visits: number;
    submissions: number;
    submissionRate: number;
    bounceRate: number;
}

export interface IUser {
    id: string;
}

export interface ICreationFormProps {
    form: UseFormReturn<formSchemaType>;
    onSubmit: (values: formSchemaType) => Promise<void>;
}

export type ElementsType = "TextField";

export type FormElement = {
    type: ElementsType;

    construct: (id: string) => FormElementInstance;

    designerBtnElement: {
        icon: React.ElementType;
        label: string;
    }

    designerComponent: React.FC;
    formComponent: React.FC;
    propertiesComponent: React.FC;
};

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?: Record<string, any>;
}

export type FormElementsType = {
    [key in ElementsType]: FormElement
}
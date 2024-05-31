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

    designerComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
    formComponent: React.FC;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
};

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?: Record<string, any>;
}

export type FormElementsType = {
    [key in ElementsType]: FormElement
}

export type DesignerContextType = {
    elements: FormElementInstance[];
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id: string) => void;
    updateElement: (id: string, element: FormElementInstance) => void;

    selectedElement: FormElementInstance | null;
    setSelectedElement: React.Dispatch<React.SetStateAction<FormElementInstance | null>>
}
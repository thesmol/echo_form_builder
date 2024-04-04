import { GetFormStats } from "@/actions/form";
import { ReactNode } from "react";

export interface StatsCardProps {
    title: string,
    icon: ReactNode,
    helperText: string,
    value: string,
    loading: boolean,
    className: string
}

export interface StatsCardsProps {
    data?: Awaited<ReturnType<typeof GetFormStats>>;
    loading: boolean;
}

export interface FormStats {
    visits: number;
    submissions: number;
    submissionRate: number;
    bounceRate: number;
}

export interface User {
    id: string;
}
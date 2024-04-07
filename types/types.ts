import { GetFormStats } from "@/actions/form";
import { ReactNode } from "react";

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

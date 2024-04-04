import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import StatsCard from "./StatsCard";
import { GetFormStats } from "@/actions/form";
import { StatsCardsProps } from "@/types/types";

async function CardStatsWrapper() {
    const stats = await GetFormStats();
    return <StatsCards loading={false} data={stats} />
};

export function StatsCards(props: StatsCardsProps) {
    const { data, loading } = props;

    const cards = [
        { title: "Всего посещений", color: "blue", helperText: "Количество посещений за все время", value: data?.visits.toLocaleString(), icon: <LuView className="text-blue-600" />},

        { title: "Всего ответов", color: "yellow", helperText: "Количество ответов за все время", value: data?.submissions.toLocaleString(), icon: <FaWpforms className="text-yellow-600" />},

        { title: "Процент ответов", color: "green", helperText: "Процент посещений с ответами", value: `${data?.submissionRate.toLocaleString()}%`, icon: <HiCursorClick className="text-green-600" />},

        { title: "Процент выхода", color: "red", helperText: "Процент посещений без ответов", value: `${data?.bounceRate.toLocaleString()}%`, icon: <TbArrowBounce className="text-red-600" />},
    ];

    return (
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <StatsCard
                    key = {card.title}
                    title={card.title}
                    icon={card.icon}
                    helperText={card.helperText}
                    value={card.value || ""}
                    loading={loading}
                    className={`shadow-md ${card.color === 'blue' ? 'shadow-blue-500' : card.color === 'yellow' ? 'shadow-yellow-500' : card.color === 'green' ? 'shadow-green-500' : 'shadow-red-500'}`}
                />
            ))}

        </div>
    )
}

export default CardStatsWrapper

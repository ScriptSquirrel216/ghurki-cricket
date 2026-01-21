import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { parseAsString, parseAsArrayOf, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dateSearchParams = parseAsArrayOf(parseAsString);

export const datesQueryOptions = () => {
	return queryOptions({
		queryKey: ["dates"],
		queryFn: () => getDates(),
		staleTime: Infinity,
	});
};

export const getDates = createServerFn({ method: "GET" }).handler(async () => {
	const [rivalries, dates] = await db.$transaction([
		db.rivalries.findMany({ orderBy: { start: "asc" }, select: { title: true, dates: true } }),
		db.dates.findMany({ orderBy: { date: "asc" }, select: { date: true, title: true } }),
	]);
	return {
		dates: dates.map(({ date, title }) => ({ title, date: format(date, "yyyy-MM-dd") })),
		rivalries: rivalries.map(({ title, dates }) => ({ title, dates: dates.map(({ date }) => format(date, "yyyy-MM-dd")) })),
	};
});

interface DateFilterProps extends React.ComponentProps<typeof Button> {
	align?: "start" | "end" | "center";
	hasRivalries?: boolean;
	hasDates?: boolean;
}

export function DateFilter({ align = "end", hasRivalries = true, hasDates = true, ...props }: DateFilterProps) {
	const { data } = useSuspenseQuery(datesQueryOptions());
	const [selectedDate, setSelectedDate] = useQueryState("date", dateSearchParams);
	const isRivalry = data.rivalries.find((rivalry) => JSON.stringify(rivalry.dates) === JSON.stringify(selectedDate));
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" {...props}>
					<HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} />
					{formatDate(selectedDate) ?? isRivalry?.title}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align} className="w-auto">
				<DropdownMenuRadioGroup value={selectedDate ? selectedDate.toString() : ""} onValueChange={() => setSelectedDate(null)}>
					<DropdownMenuRadioItem value="">All Time</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				{hasRivalries && (
					<DropdownMenuGroup>
						<DropdownMenuLabel>Rivalries</DropdownMenuLabel>
						<DropdownMenuRadioGroup value={selectedDate?.toString()} onValueChange={(value) => setSelectedDate(value.split(","))}>
							{data.rivalries.map(({ title, dates }) => (
								<DropdownMenuRadioItem key={title} value={dates.toString()}>
									<span>{title}</span>
									<span className="text-muted-foreground">({dates.length} Series)</span>
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				)}
				{hasDates && (
					<DropdownMenuGroup>
						<DropdownMenuLabel>Dates</DropdownMenuLabel>
						<DropdownMenuRadioGroup value={selectedDate?.toString()} onValueChange={(value) => setSelectedDate([value])}>
							{data.dates.map(({ date, title }) => (
								<DropdownMenuRadioItem key={date} value={date} className="justify-between">
									<span>{title}</span>
									<span className="text-muted-foreground">({date})</span>
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

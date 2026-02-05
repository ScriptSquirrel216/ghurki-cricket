import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { z } from "zod";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dateSearchSchema = z.object({
	date: z
		.string()
		.optional()
		.transform((value) => (value ? new Date(value) : undefined)),
	rivalry: z.string().optional(),
});

export type DateSearchSchema = {
	date?: string;
	rivalry?: string;
};

export const datesQueryOptions = () => {
	return queryOptions({
		queryKey: ["dates"],
		queryFn: () => getDates(),
	});
};

export const getDates = createServerFn({ method: "GET" }).handler(async () => {
	const dates = await db.dates.findMany({ orderBy: { date: "asc" }, select: { date: true, title: true, rivalryId: true } });

	const rivalriesCount = dates.reduce(
		(acc, { rivalryId }) => {
			if (rivalryId) {
				acc[rivalryId] = (acc[rivalryId] || 0) + 1;
			}
			return acc;
		},
		{} as Record<string, number>,
	);

	return {
		dates: dates.map(({ date, title }) => ({ title, date: format(date, "yyyy-MM-dd") })),
		rivalries: Object.entries(rivalriesCount).map(([title, series]) => ({ title, series })),
	};
});

type DateFilterProps = React.ComponentProps<typeof Button> & {
	hasRivalries?: boolean;
	hasDates?: boolean;
};

export function DateFilter({ hasRivalries = true, hasDates = true, ...props }: DateFilterProps) {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { data } = useSuspenseQuery(datesQueryOptions());
	const { date: selectedDate, rivalry: selectedRivalry } = useSearch({ strict: false });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" {...props}>
					<HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} />
					{formatDate(selectedDate) ?? selectedRivalry ?? "All Time"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={isMobile ? "center" : "end"} className="w-auto">
				<DropdownMenuRadioGroup
					value={!selectedDate && !selectedRivalry ? "" : "none"}
					onValueChange={() => navigate({ to: pathname, search: (prev) => ({ ...prev, date: undefined, rivalry: undefined }) })}
				>
					<DropdownMenuRadioItem value="">All Time</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				{hasRivalries && (
					<DropdownMenuGroup>
						<DropdownMenuLabel>Rivalries</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={selectedRivalry}
							onValueChange={(value) =>
								navigate({ to: pathname, search: (prev) => ({ ...prev, date: undefined, rivalry: value }) })
							}
						>
							{data.rivalries.map(({ title, series }) => (
								<DropdownMenuRadioItem key={title} value={title}>
									<span>{title}</span>
									<span className="text-muted-foreground">({series} Series)</span>
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				)}
				{hasDates && (
					<DropdownMenuGroup>
						<DropdownMenuLabel>Series</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={selectedDate?.toString()}
							onValueChange={(value) =>
								navigate({ to: pathname, search: (prev) => ({ ...prev, date: value, rivalry: undefined }) })
							}
						>
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

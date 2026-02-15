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
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dateSearchSchema = z.object({
	date: z.string().optional(),
	rivalry: z.string().optional(),
});

export const validateDate = ({ date, rivalry }: z.infer<typeof dateSearchSchema>) => {
	if (date) return { date: new Date(date) };
	if (rivalry) return { rivalryId: rivalry };
	return undefined;
};

export const datesQueryOptions = () => {
	return queryOptions({
		queryKey: ["dates"],
		queryFn: () => getDates(),
	});
};

const getDates = createServerFn({ method: "GET" }).handler(async () => {
	const dates = await db.dates.findMany({ orderBy: { date: "desc" }, select: { date: true, title: true, rivalryId: true } });

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

export type DateFilterProps = {
	options?: "dates" | "rivalries" | "both";
	side?: "start" | "center" | "end";
};

export function DateFilter({ options = "both", side = "end" }: DateFilterProps) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { data } = useSuspenseQuery(datesQueryOptions());
	const { date: selectedDate, rivalry: selectedRivalry } = useSearch({ strict: false });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					<HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} />
					{formatDate(selectedDate) ?? selectedRivalry ?? "All Time"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={side} className="w-auto">
				<DropdownMenuGroup>
					<DropdownMenuRadioGroup
						value={!selectedDate && !selectedRivalry ? "" : "none"}
						onValueChange={() => navigate({ to: pathname, search: (prev) => ({ ...prev, date: undefined, rivalry: undefined }) })}
					>
						<DropdownMenuRadioItem value="">All Time</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				{(options === "both" || options === "rivalries") && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Rivalries</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={selectedRivalry}
								onValueChange={(value) => {
									navigate({ to: pathname, search: (prev) => ({ ...prev, date: undefined, rivalry: value }) });
								}}
							>
								{data.rivalries.map(({ title, series }) => (
									<DropdownMenuRadioItem key={title} value={title} className="justify-between">
										<span>{title}</span>
										<span className="text-muted-foreground">({series} Series)</span>
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
					</>
				)}
				{(options === "both" || options === "dates") && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Series</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={selectedDate?.toString()}
								onValueChange={(value) => {
									navigate({ to: pathname, search: (prev) => ({ ...prev, date: value, rivalry: undefined }) });
								}}
							>
								{data.dates.map(({ date, title }) => (
									<DropdownMenuRadioItem key={date} value={date} className="justify-between">
										<span>{title}</span>
										<span className="text-muted-foreground">({date})</span>
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

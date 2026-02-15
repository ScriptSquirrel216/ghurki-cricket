import { FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export type StatsFilterProps = {
	options: readonly string[];
	side?: "start" | "center" | "end";
};

export function StatsFilter({ options, side = "center" }: StatsFilterProps) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { filter: selectedFilter } = useSearch({ strict: false });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="capitalize">
					<HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
					{selectedFilter?.split("-").join(" ") ?? "All Stats"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={side} className="w-auto">
				<DropdownMenuRadioGroup
					value={selectedFilter ?? ""}
					onValueChange={() => navigate({ to: pathname, search: (prev) => ({ ...prev, filter: undefined }) })}
				>
					<DropdownMenuRadioItem value="">All Stats</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuRadioGroup
					value={selectedFilter}
					onValueChange={(value) => navigate({ to: pathname, search: (prev) => ({ ...prev, filter: value as "most-runs" }) })}
				>
					{options.map((option) => (
						<DropdownMenuRadioItem key={option} value={option} className="capitalize">
							{option.split("-").join(" ")}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

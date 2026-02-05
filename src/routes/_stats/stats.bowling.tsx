import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { DateFilter, dateSearchSchema, type DateSearchSchema } from "@/components/date-filter";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type BowlingStats } from "@/lib/types";
import { ballsToOvers } from "@/lib/utils";

const bowlingStatsQueryOptions = ({ date, rivalry }: DateSearchSchema) => {
	return queryOptions({
		queryKey: ["bowling-stats", date ?? rivalry ?? "all-time"],
		queryFn: () => getBowlingStats({ data: { date, rivalry } }),
	});
};

const getBowlingStats = createServerFn({ method: "GET" })
	.inputValidator(dateSearchSchema)
	.handler(async ({ data: { date, rivalry } }): Promise<BowlingStats[]> => {
		const stats = await db.bowlers.groupBy({
			by: ["playerId"],
			where: { date: { date, rivalryId: rivalry } },
			orderBy: { _sum: { wickets: "desc" } },
			_sum: {
				innings: true,
				runs: true,
				balls: true,
				wickets: true,
				dots: true,
				wides: true,
				noBalls: true,
				twoFR: true,
				threeFR: true,
			},
		});
		return stats.map(({ playerId, _sum }) => ({
			player: playerId,
			innings: _sum.innings,
			runs: _sum.runs,
			balls: _sum.balls,
			wickets: _sum.wickets,
			economy: _sum.balls ? _sum.runs / _sum.balls : 0,
			average: _sum.wickets ? _sum.runs / _sum.wickets : Infinity,
			dots: _sum.dots,
			wides: _sum.wides,
			no_balls: _sum.noBalls,
			"2fr": _sum.twoFR,
			"3fr": _sum.threeFR,
		}));
	});

const columns: ColumnDef<BowlingStats>[] = [
	{ accessorKey: "player", header: "Player", cell: ({ row }) => <PlayerAvatarCell name={row.original.player} /> },
	{ accessorKey: "innings", header: "Inns" },
	{ accessorKey: "balls", header: "Overs", cell: ({ row }) => Number(ballsToOvers(row.original.balls)) },
	{ accessorKey: "runs", header: "Runs" },
	{ accessorKey: "wickets", header: "Wkts" },
	{ accessorKey: "economy", header: "Eco", cell: ({ row }) => (row.original.economy * 6).toFixed(1) },
	{
		accessorKey: "average",
		header: "Avg",
		cell: ({ row }) => (row.original.average === Infinity ? "-" : row.original.average.toFixed(1)),
	},
	{ accessorKey: "dots", header: "Dots" },
	{ accessorKey: "wides", header: "WDs" },
	{ accessorKey: "no_balls", header: "NBs" },
	{ accessorKey: "2fr", header: "2fr" },
	{ accessorKey: "3fr", header: "3fr" },
];

export const Route = createFileRoute("/_stats/stats/bowling")({
	head: () => ({ meta: [{ title: "Bowling Stats" }] }),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(bowlingStatsQueryOptions(context)),
	component: () => {
		const context = Route.useRouteContext();
		const { data } = useSuspenseQuery(bowlingStatsQueryOptions(context));
		return (
			<TabsLayout title="Bowling Stats" secondary={<DateFilter />}>
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

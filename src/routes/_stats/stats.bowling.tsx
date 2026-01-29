import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type BowlingStats } from "@/lib/types";
import { ballsToOvers } from "@/lib/utils";

const bowlingStatsQueryOptions = () => {
	return queryOptions({
		queryKey: ["bowling-stats"],
		queryFn: () => getBowlingStats(),
	});
};

const getBowlingStats = createServerFn({ method: "GET" }).handler(async (): Promise<BowlingStats[]> => {
	const stats = await db.bowlers.groupBy({
		by: ["playerId"],
		_max: { wickets: true },
		orderBy: { _sum: { wickets: "desc" } },
		_sum: {
			innings: true,
			runs: true,
			balls: true,
			wickets: true,
			fours: true,
			sixes: true,
			dots: true,
			wides: true,
			noBalls: true,
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
		fours: _sum.fours,
		sixes: _sum.sixes,
		dots: _sum.dots,
		wides: _sum.wides,
		no_balls: _sum.noBalls,
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
	{ accessorKey: "fours", header: "4s" },
	{ accessorKey: "sixes", header: "6s" },
	{ accessorKey: "dots", header: "Dots" },
	{ accessorKey: "wides", header: "WDs" },
	{ accessorKey: "no_balls", header: "NBs" },
];

export const Route = createFileRoute("/_stats/stats/bowling")({
	head: () => ({ meta: [{ title: "Bowling Stats" }] }),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(bowlingStatsQueryOptions()),
	component: () => {
		const { data } = useSuspenseQuery(bowlingStatsQueryOptions());
		return (
			<TabsLayout title="Bowling Stats">
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

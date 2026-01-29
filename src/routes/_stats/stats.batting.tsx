import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type BattingStats } from "@/lib/types";

const battingStatsQueryOptions = () => {
	return queryOptions({
		queryKey: ["batting-stats"],
		queryFn: () => getBattingStats(),
	});
};

const getBattingStats = createServerFn({ method: "GET" }).handler(async (): Promise<BattingStats[]> => {
	const stats = await db.batters.groupBy({
		by: ["playerId"],
		orderBy: { _sum: { runs: "desc" } },
		_max: { highestScore: true },
		_sum: { innings: true, runs: true, balls: true, notOuts: true, fours: true, sixes: true, dots: true, ducks: true },
	});
	return stats.map(({ playerId, _sum, _max }) => ({
		player: playerId,
		innings: _sum.innings,
		runs: _sum.runs,
		balls: _sum.balls,
		not_outs: _sum.notOuts,
		highest_score: _max.highestScore,
		strike_rate: _sum.balls ? (_sum.runs / _sum.balls) * 100 : 0,
		average: _sum.innings - _sum.notOuts ? _sum.runs / (_sum.innings - _sum.notOuts) : 0,
		fours: _sum.fours,
		sixes: _sum.sixes,
		dots: _sum.dots,
		ducks: _sum.ducks,
	}));
});

const columns: ColumnDef<BattingStats>[] = [
	{ accessorKey: "player", header: "Player", cell: ({ row }) => <PlayerAvatarCell name={row.original.player} /> },
	{ accessorKey: "innings", header: "Inns" },
	{ accessorKey: "runs", header: "Runs" },
	{ accessorKey: "balls", header: "Balls" },
	{ accessorKey: "highest_score", header: "HS" },
	{ accessorKey: "not_outs", header: "NO" },
	{ accessorKey: "strike_rate", header: "SR", cell: ({ row }) => row.original.strike_rate.toFixed() },
	{ accessorKey: "average", header: "Avg", cell: ({ row }) => row.original.average.toFixed() },
	{ accessorKey: "fours", header: "4s" },
	{ accessorKey: "sixes", header: "6s" },
	{ accessorKey: "dots", header: "Dots" },
	{ accessorKey: "ducks", header: "Ducks" },
];

export const Route = createFileRoute("/_stats/stats/batting")({
	head: () => ({ meta: [{ title: "Batting Stats" }] }),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(battingStatsQueryOptions()),
	component: () => {
		const { data } = useSuspenseQuery(battingStatsQueryOptions());
		return (
			<TabsLayout title="Batting Stats">
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

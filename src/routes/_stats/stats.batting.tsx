import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { DateFilter, dateSearchSchema, type DateSearchSchema } from "@/components/date-filter";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type BattingStats } from "@/lib/types";

const battingStatsQueryOptions = ({ date, rivalry }: DateSearchSchema) => {
	return queryOptions({
		queryKey: ["batting-stats", date ?? rivalry ?? "all-time"],
		queryFn: () => getBattingStats({ data: { date, rivalry } }),
	});
};

const getBattingStats = createServerFn({ method: "GET" })
	.inputValidator(dateSearchSchema)
	.handler(async ({ data: { date, rivalry } }): Promise<BattingStats[]> => {
		const stats = await db.batters.groupBy({
			by: ["playerId"],
			where: { date: { date, rivalryId: rivalry } },
			orderBy: { _sum: { runs: "desc" } },
			_max: { highestScore: true },
			_sum: {
				innings: true,
				runs: true,
				balls: true,
				notOuts: true,
				fours: true,
				sixes: true,
				ducks: true,
				fifties: true,
				hundreds: true,
			},
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
			ducks: _sum.ducks,
			fifties: _sum.fifties,
			hundreds: _sum.hundreds,
		}));
	});

const columns: ColumnDef<BattingStats>[] = [
	{ accessorKey: "player", header: "Player", cell: ({ row }) => <PlayerAvatarCell name={row.original.player} /> },
	{ accessorKey: "innings", header: "Inns" },
	{ accessorKey: "runs", header: "Runs" },
	{ accessorKey: "balls", header: "Balls" },
	{ accessorKey: "strike_rate", header: "SR", cell: ({ row }) => row.original.strike_rate.toFixed() },
	{ accessorKey: "average", header: "Avg", cell: ({ row }) => row.original.average.toFixed() },
	{ accessorKey: "highest_score", header: "HS" },
	{ accessorKey: "fours", header: "4s" },
	{ accessorKey: "sixes", header: "6s" },
	{ accessorKey: "ducks", header: "0s" },
	{ accessorKey: "fifties", header: "50s" },
	{ accessorKey: "hundreds", header: "100s" },
];

export const Route = createFileRoute("/_stats/stats/batting")({
	head: () => ({ meta: [{ title: "Batting Stats" }] }),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(battingStatsQueryOptions(context)),
	component: () => {
		const context = Route.useRouteContext();
		const { data } = useSuspenseQuery(battingStatsQueryOptions(context));
		return (
			<TabsLayout title="Batting Stats" secondary={<DateFilter />}>
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

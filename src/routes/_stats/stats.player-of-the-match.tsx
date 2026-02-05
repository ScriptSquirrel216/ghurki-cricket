import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { DateFilter, dateSearchSchema, type DateSearchSchema } from "@/components/date-filter";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type ManOfMatchStats } from "@/lib/types";

const playerOfMatchStatsQueryOptions = ({ date, rivalry }: DateSearchSchema) => {
	return queryOptions({
		queryKey: ["player-of-match-stats", date ?? rivalry ?? ["all-time"]],
		queryFn: () => getPlayerOfMatchStats({ data: { date, rivalry } }),
	});
};

const getPlayerOfMatchStats = createServerFn({ method: "GET" })
	.inputValidator(dateSearchSchema)
	.handler(async ({ data: { date, rivalry } }): Promise<ManOfMatchStats[]> => {
		const stats = await db.players.findMany({
			where: { playerOfMatches: { every: { date: { date, rivalryId: rivalry } } } },
			select: { name: true, _count: { select: { playerOfMatches: true } } },
		});
		return stats.map(({ _count, name }) => ({ player: name, count: _count.playerOfMatches })).filter(({ count }) => count > 0);
	});

const columns: ColumnDef<ManOfMatchStats>[] = [
	{ accessorKey: "player", header: "Player", cell: ({ row }) => <PlayerAvatarCell name={row.original.player} /> },
	{ accessorKey: "count", header: "Player of Match" },
];

export const Route = createFileRoute("/_stats/stats/player-of-the-match")({
	head: () => ({ meta: [{ title: "Player of the Match Stats" }] }),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(playerOfMatchStatsQueryOptions(context)),
	component: () => {
		const context = Route.useRouteContext();
		const { data } = useSuspenseQuery(playerOfMatchStatsQueryOptions(context));
		return (
			<TabsLayout title="Player of the Match Stats" secondary={<DateFilter />}>
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

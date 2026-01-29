import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type ManOfMatchStats } from "@/lib/types";

const playerOfMatchStatsQueryOptions = () => {
	return queryOptions({
		queryKey: ["player-of-match-stats"],
		queryFn: () => getPlayerOfMatchStats(),
	});
};

const getPlayerOfMatchStats = createServerFn({ method: "GET" }).handler(async (): Promise<ManOfMatchStats[]> => {
	const stats = await db.players.findMany({
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
	loader: async ({ context }) => await context.queryClient.ensureQueryData(playerOfMatchStatsQueryOptions()),
	component: () => {
		const { data } = useSuspenseQuery(playerOfMatchStatsQueryOptions());
		return (
			<TabsLayout title="Player of the Match Stats">
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

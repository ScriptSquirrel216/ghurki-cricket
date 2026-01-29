import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { PlayerAvatarCell } from "@/components/players/avatar";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { db } from "@/lib/db";
import { type FieldingStats } from "@/lib/types";

const fieldingStatsQueryOptions = () => {
	return queryOptions({
		queryKey: ["fielding-stats"],
		queryFn: () => getFieldingStats(),
	});
};

const getFieldingStats = createServerFn({ method: "GET" }).handler(async (): Promise<FieldingStats[]> => {
	const stats = await db.fielders.groupBy({
		by: ["playerId"],
		orderBy: { _sum: { catches: "desc" } },
		_sum: { innings: true, catches: true, runOuts: true },
	});
	return stats.map(({ playerId, _sum }) => ({
		player: playerId,
		innings: _sum.innings,
		catches: _sum.catches,
		runOuts: _sum.runOuts,
	}));
});

const columns: ColumnDef<FieldingStats>[] = [
	{ accessorKey: "player", header: "Player", cell: ({ row }) => <PlayerAvatarCell name={row.original.player} /> },
	{ accessorKey: "innings", header: "Innings" },
	{ accessorKey: "catches", header: "Catches" },
	{ accessorKey: "runOuts", header: "Run Outs" },
];

export const Route = createFileRoute("/_stats/stats/fielding")({
	head: () => ({ meta: [{ title: "Fielding Stats" }] }),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(fieldingStatsQueryOptions()),
	component: () => {
		const { data } = useSuspenseQuery(fieldingStatsQueryOptions());
		return (
			<TabsLayout title="Fielding Stats">
				<DataTable columns={columns} data={data} />
			</TabsLayout>
		);
	},
});

import { createFileRoute } from "@tanstack/react-router";

import { TabsLayout } from "@/components/tabs/tabs-layout";

function PlayerOfTheMatchStats() {
	return <TabsLayout title="Player of the Match Stats"></TabsLayout>;
}

export const Route = createFileRoute("/_stats/stats/player-of-the-match")({
	component: PlayerOfTheMatchStats,
	head: () => ({ meta: [{ title: "Player of the Match Stats" }] }),
});

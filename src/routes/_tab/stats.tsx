import { createFileRoute } from "@tanstack/react-router";

function StatsRoute() {
	return <></>;
}

export const Route = createFileRoute("/_tab/stats")({
	component: StatsRoute,
	head: () => ({ meta: [{ title: "Stats" }] }),
});

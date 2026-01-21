import { createFileRoute } from "@tanstack/react-router";

function PlayersRoute() {
	return <></>;
}

export const Route = createFileRoute("/_tab/players")({
	component: PlayersRoute,
	head: () => ({ meta: [{ title: "Players" }] }),
});

import { createFileRoute } from "@tanstack/react-router";

function MatchesRoute() {
	return <></>;
}

export const Route = createFileRoute("/_tab/matches")({
	component: MatchesRoute,
	head: () => ({ meta: [{ title: "Matches" }] }),
});

import { createFileRoute } from "@tanstack/react-router";

function CompareRoute() {
	return <></>;
}

export const Route = createFileRoute("/_tab/compare")({
	component: CompareRoute,
	head: () => ({ meta: [{ title: "Compare" }] }),
});

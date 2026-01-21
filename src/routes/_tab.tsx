import { SignalNo02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import { DateFilter, datesQueryOptions } from "@/components/date-filter";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export const tabItems = [
	{ name: "Matches", url: "/matches", icon: "/icons/matches.png", dateFilter: true },
	{ name: "Stats", url: "/stats", icon: "/icons/stats.png", dateFilter: false },
	{ name: "Compare", url: "/compare", icon: "/icons/compare.png", dateFilter: true },
	{ name: "Players", url: "/players", icon: "/icons/players.png", dateFilter: false },
];

function TabLayout() {
	const { pathname } = useLocation();
	const activeItem = tabItems.find((item) => item.url === pathname);
	return (
		<main className="flex h-dvh flex-col gap-4">
			{activeItem && (
				<header className="container mx-auto flex items-center justify-between px-4 pt-4">
					<h1 className="text-xl font-semibold capitalize">{activeItem.name}</h1>
					{activeItem.dateFilter && <DateFilter />}
				</header>
			)}
			<div className="container mx-auto flex-1 overflow-y-auto px-4">
				<Outlet />
			</div>
			<footer className="border-t">
				<div className="container mx-auto grid grid-cols-4 px-4 pt-3 pb-2">
					{tabItems.map((item) => {
						const isCurrentRoute = pathname === item.url;
						return (
							<Link to={item.url} key={item.name} className="group flex flex-col items-center px-2">
								<div
									className={cn(
										"flex w-full max-w-15 justify-center rounded-full py-1.5 transition-colors group-hover:bg-muted-foreground/40",
										isCurrentRoute && "bg-blue-700/40 group-hover:bg-blue-700/40",
									)}
								>
									<img src={item.icon} width={20} height={20} alt={item.name} className="aspect-square" />
								</div>
								<p className={cn("", isCurrentRoute && "font-medium")} style={{ fontSize: 13 }}>
									{item.name}
								</p>
							</Link>
						);
					})}
				</div>
			</footer>
		</main>
	);
}

export const Route = createFileRoute("/_tab")({
	component: TabLayout,
	loader: ({ context }) => context.queryClient.ensureQueryData(datesQueryOptions()),
	notFoundComponent: () => (
		<Empty className="">
			<EmptyMedia variant="icon">
				<HugeiconsIcon icon={SignalNo02Icon} strokeWidth={2} />
			</EmptyMedia>
			<EmptyContent>
				<EmptyTitle>Not Found</EmptyTitle>
				<EmptyDescription>The page you are looking for does not exist.</EmptyDescription>
			</EmptyContent>
		</Empty>
	),
	errorComponent: () => (
		<Empty className="">
			<EmptyMedia variant="icon">
				<HugeiconsIcon icon={SignalNo02Icon} strokeWidth={2} />
			</EmptyMedia>
			<EmptyContent>
				<EmptyTitle>Error</EmptyTitle>
				<EmptyDescription>Something went wrong.</EmptyDescription>
			</EmptyContent>
		</Empty>
	),
});

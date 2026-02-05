import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import { statsItems } from "@/components/tabs/items";
import { cn } from "@/lib/utils";

function StatsLayout() {
	const { pathname } = useLocation();
	return (
		<main className="flex h-dvh flex-col">
			<Outlet />
			<footer className="md:border-t">
				<div className="container mx-auto grid grid-cols-5 px-1 py-2 md:py-3">
					{statsItems.map((item) => {
						const isCurrentRoute = pathname === item.url;
						return (
							<Link to={item.url} key={item.name} className="group flex flex-col items-center px-1">
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

export const Route = createFileRoute("/_stats")({
	component: StatsLayout,
});

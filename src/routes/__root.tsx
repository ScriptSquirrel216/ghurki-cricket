import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ title: "Ghurki Cricket Scorer" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<NuqsAdapter>{children}</NuqsAdapter>
					<Toaster />
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}

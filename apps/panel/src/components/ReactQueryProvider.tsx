"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

export function ReactQueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 1000,
					},
				},
			}),
	);
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>
				{children}
			</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
}

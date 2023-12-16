import React from "react";
import SideBar from "./layout/components/SideBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-row h-screen">
			<aside className="min-w-[200px]">
				<SideBar />
			</aside>
			<main className="flex-1 p-8 h-full overflow-auto">{children}</main>
		</div>
	);
}

"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function InvalidLink() {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-2">
			<h1 className="m-0 text-[24px] text-center font-[700]">
				Invalid link
			</h1>
			<span>The link specified does not exist.</span>
			<div>
				<Button
					onClick={() => router.replace("/login")}
					variant="contained"
					color="primary"
				>
					Login
				</Button>
			</div>
		</div>
	);
}

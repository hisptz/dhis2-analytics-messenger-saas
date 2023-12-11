"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function VerifyEmailSuccess() {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-2">
			<h1 className="m-0 text-[24px] text-center font-[700]">
				Email verification
			</h1>
			<span>
				You have successfully verified your email. You can now login to
				your account.
			</span>
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

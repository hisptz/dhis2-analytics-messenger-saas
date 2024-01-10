"use client";

import { ParseClient } from "@/utils/parse/client";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function WaitingApproval() {
	const [, , removeCookie] = useCookies(["sessionToken"]);
	const router = useRouter();

	const onLogout = async () => {
		await ParseClient.User.logOut();
		removeCookie("sessionToken");
		router.replace("/login");
	};

	return (
		<div className="flex flex-col gap-2 p-4">
			<h1 className="m-0 text-[24px] text-center font-[700]">
				Approval request sent
			</h1>
			<p>
				Our administrators have received your request to use the DHIS2
				analytics messenger and we will notify you when your request is
				accepted
			</p>
			<div>
				<Button variant="contained" onClick={onLogout}>
					Logout
				</Button>
			</div>
		</div>
	);
}

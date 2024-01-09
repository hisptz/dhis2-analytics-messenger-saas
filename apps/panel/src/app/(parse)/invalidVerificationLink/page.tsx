"use client";

import { useSearchParams } from "next/navigation";
import { ParseClient } from "@/utils/parse/client";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";

export default function InvalidVerificationLink() {
	const params = useSearchParams();
	const handleVerifyEmail = async () => {
		try {
			const username = params.get("username");
			const response = await ParseClient.Cloud.run(
				"requestEmailVerification",
				{
					username,
				},
			);
			console.log(response);
			alert("A verification email has been sent to your email");
		} catch (e: any) {
			alert(`Could not resend verification: ${e.message}`);
			console.error(e);
		}
	};

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [params],
		mutationFn: handleVerifyEmail,
	});
	return (
		<div className="flex flex-col gap-2">
			<h1 className="m-0 text-[24px] text-center font-[700]">
				Invalid email verification link
			</h1>
			<span>The link specified does not exist or has expired.</span>
			<div>
				<LoadingButton
					loading={isPending}
					onClick={() => mutateAsync()}
					variant="contained"
					color="primary"
				>
					Resend verification email
				</LoadingButton>
			</div>
		</div>
	);
}

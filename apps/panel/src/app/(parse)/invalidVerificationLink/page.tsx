"use client";

import { useSearchParams } from "next/navigation";
import { ParseClient } from "@/utils/parse/client";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import { useCustomAlert } from "../../hooks/useCustomAlert";

export default function InvalidVerificationLink() {
	const params = useSearchParams();
	const { show: showAlert } = useCustomAlert();
	const handleVerifyEmail = async () => {
		try {
			const username = params.get("username");
			const response = await ParseClient.Cloud.run(
				"requestEmailVerification",
				{
					username,
				},
			);
			showAlert({
				message: `A verification email has been sent to your email`,
				type: "success",
			});
		} catch (e: any) {
			showAlert({
				message: `Could not resend verification: ${e.message}`,
				type: "error",
			});
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

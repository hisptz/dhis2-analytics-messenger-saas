"use client";
import { useSearchParams } from "next/navigation";
import { ParseClient } from "@/utils/parse/client";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "@tanstack/react-query";

export default function VerifyEmail() {
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
		<div className="flex flex-col gap-2 p-4">
			<h1 className="m-0 text-[24px] text-center font-[700]">
				Verify your email
			</h1>
			<p>
				We've sent you a verification email to your email. Please verify
				you email to continue
			</p>
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

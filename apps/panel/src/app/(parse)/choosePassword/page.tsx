"use client";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { RHFPasswordInput } from "@/components/RHFPasswordInput";
import { useBoolean } from "usehooks-ts";
import { LoadingButton } from "@mui/lab";
import { useSearchParams } from "next/navigation";
import { submitResetPasswordRequest } from "@/utils/parse/passwordReset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomAlert } from "../../hooks/useCustomAlert";

const passwordResetFormSchema = z.object({
	password: z
		.string()
		.min(8, "Password should have at least 8 characters")
		.regex(/[A-Z]/, "Password should have at least one capital letter")
		.regex(/[a-z]/, "Password should have at least one small letter")
		.regex(/\d/, "Password should have at least one number"),
});

type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;

export default function ChoosePassword() {
	const params = useSearchParams();
	const { show: showAlert } = useCustomAlert();
	const { value: showPassword, toggle: toggleShowPassword } =
		useBoolean(false);
	const form = useForm<PasswordResetFormData>({
		resolver: zodResolver(passwordResetFormSchema),
	});

	const onSubmit = async ({ password }: PasswordResetFormData) => {
		const token = params.get("token");
		const id = params.get("id");
		const username = params.get("username");

		if (!token || !username) {
			return;
		}

		const data = {
			token,
			id,
			new_password: password,
			username,
		};
		try {
			await submitResetPasswordRequest(data, {
				appId: id as string,
			});
		} catch (e) {
			showAlert({
				message:
					"Invalid link. Please try requesting your password again",
				type: "error",
			});
			console.error(e);
		}
	};

	return (
		<div className="flex flex-col gap-2 p-4">
			<h1 className="m-0 text-[24px] text-center font-[700]">
				Reset Password
			</h1>
			<p>Enter your new password</p>
			<FormProvider {...form}>
				<RHFPasswordInput
					name="password"
					required
					fullWidth
					type={showPassword ? "text" : "password"}
					id="password"
					label="Password"
					size="small"
				/>
			</FormProvider>
			<div>
				<LoadingButton
					loading={form.formState.isSubmitting}
					onClick={form.handleSubmit(onSubmit)}
					variant="contained"
					color="primary"
				>
					Reset Password
				</LoadingButton>
			</div>
		</div>
	);
}

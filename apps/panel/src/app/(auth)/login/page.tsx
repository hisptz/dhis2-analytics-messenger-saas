"use client";
import { Button, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextInput } from "@/components/RHFTextInput";
import { LoadingButton } from "@mui/lab";
import { ParseClient } from "@/utils/parse/client";
import { RHFPasswordInput } from "@/components/RHFPasswordInput";
import { useCustomAlert } from "../../hooks/useCustomAlert";
import { useState } from "react";
import ForgetPasswordModal from "./components/ForgetPasswordModal";
import { useCookies } from "react-cookie";

const loginSchema = z.object({
	username: z.string({ required_error: "Username is required" }),
	password: z
		.string()
		.min(8, "Password should have at least 8 characters")
		.regex(/[A-Z]/, "Password should have at least one capital letter")
		.regex(/\d/, "Password should have at least one number"),
});

export type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
	const [forgetPasswordOpen, setForgetPasswordOpen] = useState(false);
	const [, setCookie] = useCookies(["sessionToken"]);
	const router = useRouter();
	const form = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
	});
	const { show: showAlert } = useCustomAlert();
	const onLogin = async (data: LoginData) => {
		try {
			const user = await ParseClient.User.logIn(
				data.username,
				data.password,
			);
			if (user) {
				setCookie("sessionToken", user.getSessionToken());
				router.replace("/");
			}
		} catch (e: any) {
			if (e.code === 205) {
				router.replace(`/verifyEmail?username=${data.username}`);
				return;
			}
			showAlert({
				message: e.message,
				type: "error",
			});
		}
	};

	const onResetPassword = () => {
		setForgetPasswordOpen(true);
	};

	const { replace } = useRouter();
	const onSignUpClicked = () => {
		replace("signup");
	};

	return (
		<div className="h-full w-full flex flex-col items-center justify-center gap-[16px] text-center">
			<div className="text-primary-500 font-bold text-2xl ">Login</div>
			<div className="flex flex-col gap-[32px]">
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onLogin)}
						className="flex flex-col items-start justify-start gap-[24px] w-full"
					>
						<div className="flex flex-col items-center justify-start gap-[16px] w-full">
							<RHFTextInput
								fullWidth
								size="small"
								required
								name="username"
								type="text"
								id="username"
								label="Username"
							/>
							<RHFPasswordInput
								size="small"
								fullWidth
								name="password"
								required
								type="password"
								id="password"
								label="Password"
							/>
							<span className="text-sm">
								Forgot your password?{" "}
								<span
									color="#008edd"
									className="text-primary-500 pointer underline"
									style={{
										cursor: "pointer",
									}}
									onClick={onResetPassword}
								>
									Click here
								</span>
							</span>
						</div>
						<LoadingButton
							loadingIndicator="Please wait..."
							loading={form.formState.isSubmitting}
							type="submit"
							fullWidth
							className="bg-primary-500 rounded-full pointer text-white"
							variant="contained"
						>
							Login
						</LoadingButton>
					</form>
				</FormProvider>
				<div className="flex flex-col gap-[16px]">
					<Divider role="presentation" color="primary">
						OR
					</Divider>
					<Button
						className=" rounded-full pointer text-primary-500"
						variant="outlined"
						onClick={onSignUpClicked}
					>
						Sign up
					</Button>
				</div>
				<ForgetPasswordModal
					open={forgetPasswordOpen}
					onClose={() => setForgetPasswordOpen(false)}
				/>
			</div>
		</div>
	);
}

"use client";

import { RHFTextInput } from "@/components/RHFTextInput";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { ParseClient } from "@/utils/parse/client";
import { useCustomAlert } from "../../../hooks/useCustomAlert";

const forgetPasswordSchema = z.object({
	email: z.string().email(),
});

export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPasswordModal(props: any) {
	const { open, onClose } = props;
	const { show: showAlert } = useCustomAlert();
	const form = useForm<ForgetPasswordData>({
		resolver: zodResolver(forgetPasswordSchema),
	});

	const onRequestPasswordChange = async (data: ForgetPasswordData) => {
		const { email } = data;
		try {
			await ParseClient.User.requestPasswordReset(email);
			showAlert({
				message:
					"Email is sent successfully, check your email to reset password",
				type: "success",
			});
		} catch (error: any) {
			showAlert({
				message: "Error: " + error.code + " " + error.message,
				type: "error",
			});
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs">
			<DialogTitle sx={{ mb: -2 }}>Request Password Reset</DialogTitle>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onRequestPasswordChange)}>
					<DialogContent>
						<RHFTextInput
							name="email"
							margin="dense"
							type="email"
							id="email"
							label="Email"
							helperText="Enter a valid email"
						/>
					</DialogContent>
					<DialogActions>
						<Button
							className="w-24"
							color="inherit"
							sx={{
								textTransform: "none",
								borderRadius: "50px",
								color: "GrayText",
							}}
							onClick={onClose}
							variant="outlined"
						>
							Cancel
						</Button>
						<LoadingButton
							loading={form.formState.isSubmitting}
							className="bg-primary-500 w-24"
							color="primary"
							sx={{ textTransform: "none", borderRadius: "50px" }}
							variant="contained"
							type="submit"
						>
							Send
						</LoadingButton>
					</DialogActions>
				</form>
			</FormProvider>
		</Dialog>
	);
}

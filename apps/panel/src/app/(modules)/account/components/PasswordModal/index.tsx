import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Parse from "parse";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFPasswordInput } from "@/components/RHFPasswordInput";
import { useCustomAlert } from "../../../../hooks/useCustomAlert";

const passwordSchema = z.object({
	oldPassword: z
		.string()
		.min(8, "Password should have at least 8 characters")
		.regex(/[A-Z]/, "Password should have at least one capital letter")
		.regex(/\d/, "Password should have at least one number"),
	newPassword: z
		.string()
		.min(8, "Password should have at least 8 characters")
		.regex(/[A-Z]/, "Password should have at least one capital letter")
		.regex(/\d/, "Password should have at least one number"),
});
export type PasswordData = z.infer<typeof passwordSchema>;
export default function ChangePasswordModal(props: any) {
	const [updating, setUpdating] = useState(false);
	const { show: showAlert } = useCustomAlert();
	const { open, onClose } = props;
	const form = useForm<PasswordData>({
		resolver: zodResolver(passwordSchema),
	});
	const currentUser = Parse.User.current();

	const onEdit = async (data: PasswordData) => {
		setUpdating(true);
		const { username } = currentUser?.attributes ?? {};

		if (!username) {
			showAlert({
				message:
					"Failed to fetch current user, hence can not change passwords!",
				type: "error",
			});
			return;
		}
		const { newPassword, oldPassword } = data;
		try {
			const user = await Parse.User.logIn(username, oldPassword);
			if (user) {
				user.setPassword(newPassword);
				await user.save().then(
					(updatedUser) => {
						setUpdating(false);
						showAlert({
							message: `${updatedUser.get(
								"fullName",
							)}'s password updated successfully`,
							type: "success",
						});
						onClose();
					},
					(error: any) => {
						setUpdating(false);
						showAlert({
							message: error.message,
							type: "error",
						});
					},
				);
			}
		} catch (error: any) {
			setUpdating(false);
			showAlert({
				message: error.message,
				type: "error",
			});
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs">
			<DialogTitle sx={{ mb: -2 }}>Change User Password</DialogTitle>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onEdit)}>
					<DialogContent>
						<RHFPasswordInput
							name="oldPassword"
							margin="dense"
							type="password"
							label="Old Password"
						/>
						<RHFPasswordInput
							name="newPassword"
							margin="dense"
							type="password"
							label="New Password"
							sx={{ mb: 8 }}
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
							loading={updating}
							className="rounded-full bg-primary-500 w-24"
							type="submit"
							color="primary"
							sx={{ textTransform: "none", borderRadius: "50px" }}
							variant="contained"
						>
							Save
						</LoadingButton>
					</DialogActions>
				</form>
			</FormProvider>
		</Dialog>
	);
}

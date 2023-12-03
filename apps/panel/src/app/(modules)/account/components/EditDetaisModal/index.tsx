import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";
import Parse from "parse";
import Button from "@mui/material/Button";

import { RHFTextInput } from "@/components/RHFTextInput";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editSchema = z.object({
	username: z.string().min(4, "Username should have at least 4 characters"),
	email: z.string().email(),
});
export type EditData = z.infer<typeof editSchema>;

export default function EditDetailsModal(props: any) {
	const [editing, setEditing] = useState(false);
	const { open, onClose } = props;
	const form = useForm<EditData>({
		resolver: zodResolver(editSchema),
		// defaultValues: {
		//     consent: true
		// }
	});
	const onEdit = async (data: EditData) => {
		setEditing(true);
		const currentUser = Parse.User.current();
		if (currentUser) {
			currentUser.set("email", data.email);
			currentUser.set("username", data.username);

			await currentUser.save().then(
				(updatedUser) => {
					alert(
						`${updatedUser.get(
							"fullName",
						)}'s details updated successfully`,
					);

					onClose();
				},
				(error: any) => {
					alert(error.message);
				},
			);
			setEditing(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs">
			<DialogTitle sx={{ mb: -2 }}>Edit User Details</DialogTitle>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onEdit)}>
					<DialogContent>
						<RHFTextInput
							name="username"
							margin="dense"
							id="username"
							type="text"
							label="Username"
						/>
						<RHFTextInput
							name="email"
							margin="dense"
							type="email"
							id="email"
							label="Email"
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
							loading={editing}
							className="bg-primary-500 w-24"
							color="primary"
							sx={{ textTransform: "none", borderRadius: "50px" }}
							variant="contained"
							type="submit"
						>
							Save
						</LoadingButton>
					</DialogActions>
				</form>
			</FormProvider>
		</Dialog>
	);
}

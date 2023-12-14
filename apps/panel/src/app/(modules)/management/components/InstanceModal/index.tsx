"use client";

import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { RHFTextInput } from "@/components/RHFTextInput";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import Parse from "parse";
import { isEmpty } from "lodash";
import { RHFPasswordInput } from "@/components/RHFPasswordInput";

interface DHIS2AnalyticsModalProps {
	defaultValue?: Parse.Object;
	open: boolean;
	onClose: () => void;
	onFormSubmit?: () => void;
}

const DHIS2AnalyticsModal: React.FC<DHIS2AnalyticsModalProps> = ({
	open,
	onClose,
	defaultValue,
	onFormSubmit,
}) => {
	const instanceSchema = z
		.object({
			name: z.string(),
			url: z
				.string({ required_error: "DHIS2 Instance URL is required" })
				.url(),
			pat: z.string({
				required_error: "Personal access token  is required",
			}),
		})
		.superRefine(async (value, context) => {
			const url = `${value.url}/api/me`;
			try {
				if (!/x{42}/.test(value.pat)) {
					//If there are 42 xs then it is in edit mode and the PAT has not been changed. The pat isn't real ignore the validation
					const response = await fetch(url, {
						headers: {
							Authorization: `ApiToken ${value.pat}`,
						},
					});

					if (response.status === 401) {
						context.addIssue({
							code: z.ZodIssueCode.invalid_string,
							path: ["pat"],
							message: "Invalid DHIS2 instance PAT",
						} as any);
					}
				}
				if (!defaultValue) {
					const queryResponse = await new Parse.Query("DHIS2Instance")
						.equalTo("url", value.url)
						.find();

					if (!isEmpty(queryResponse)) {
						context.addIssue({
							code: z.ZodIssueCode.invalid_string,
							path: ["url"],
							message: "This DHIS2 instance already exists",
						} as any);
					}
				}
			} catch (e) {
				console.log(e);
				context.addIssue({
					code: z.ZodIssueCode.invalid_string,
					path: ["url"],
					message: "Invalid DHIS2 instance URL",
				} as any);
				return false;
			}
		});

	type InstanceData = z.infer<typeof instanceSchema>;

	const onSubmit = async (data: InstanceData) => {
		if (defaultValue) {
			await defaultValue.save({
				...data,
			});
		} else {
			const currentUser = Parse.User.current();
			const newObject = new Parse.Object("DHIS2Instance");
			newObject.setACL(new Parse.ACL(currentUser));
			await newObject.save({
				...data,
				user: currentUser,
			});
		}
		if (onFormSubmit) {
			onFormSubmit();
		}
	};

	const form = useForm<InstanceData>({
		resolver: zodResolver(instanceSchema),
		reValidateMode: "onSubmit",
		defaultValues: defaultValue
			? {
					...(defaultValue?.attributes ?? {}),
			  }
			: {},
	});

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="form-dialog-instance"
			maxWidth="xs"
		>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogTitle id="form-dialog-instance">
						DHIS2 Analytics Instance
					</DialogTitle>
					<DialogContent>
						<RHFTextInput
							name="name"
							margin="dense"
							label="Name"
							type="text"
							placeholder="National HMIS"
						/>
						<RHFTextInput
							name="url"
							margin="dense"
							label="DHIS2 Instance URL"
							type="url"
							placeholder="https://play.dhis2.org/latest"
						/>
						<RHFPasswordInput
							name="pat"
							margin="dense"
							label="DHIS2 Personal Access Token"
							type="text"
							placeholder="d2pat_Y4mz51thbInYTmavwGJxrxeP4DeyUIhs2508976054"
						/>
					</DialogContent>
					<DialogActions>
						<Button
							className="text-black w-24"
							sx={{ textTransform: "none", borderRadius: "50px" }}
							onClick={onClose}
							variant="outlined"
						>
							Cancel
						</Button>
						<LoadingButton
							loading={
								form.formState.isSubmitting ||
								form.formState.isValidating
							}
							className="rounded-full bg-primary-500 w-24"
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
};
export default DHIS2AnalyticsModal;

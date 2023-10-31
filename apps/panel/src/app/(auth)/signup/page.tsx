"use client";
import {Button, Divider} from "@mui/material";
import {useRouter} from "next/navigation";
import {z} from "zod"
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {RHFTextInput} from "@/components/RHFTextInput";
import {RHFCheckbox} from "@/components/RHFCheckbox";
import {useBoolean} from "usehooks-ts";
import {LoadingButton} from "@mui/lab";
import {RHFPasswordInput} from "@/components/RHFPasswordInput";
import {ParseClient} from "@/utils/parse/client";

const signupFormSchema = z.object({
		fullName: z.string().refine((value) => value.includes(" "), "A space is required between your first and last name"),
		username: z.string().min(4, "Username should have at least 4 characters"),
		phoneNumber: z.string().optional(),
		email: z.string().email(),
		password: z.string().min(8, "Password should have at least 8 characters").regex(/[A-Z]/, "Password should have at least one capital letter").regex(/\d/, "Password should have at least one number"),
		consent: z.boolean().refine((value) => value, "You must consent to the privacy policy to continue")
})

export type SignFormData = z.infer<typeof signupFormSchema>;

export default function SignUpSide() {
		const router = useRouter();
		const {value: showPassword, toggle: toggleShowPassword} = useBoolean(false)
		const onSignup = async ({username, password, email, phoneNumber, fullName}: SignFormData) => {
				try {
						const user = await ParseClient.User.signUp(username, password, {
								fullName,
								email,
								phoneNumber
						});

						if (user) {
								router.replace('/')
						}
				} catch (e: any) {
						alert(e.message)
				}
		}

		const form = useForm<SignFormData>({
				resolver: zodResolver(signupFormSchema),
				defaultValues: {
						consent: true
				}
		})
		const {replace} = useRouter();

		const onLoginClicked = () => {
				replace("login");
		}

		return (
				<div
						className="h-full w-full flex flex-col items-center justify-center gap-[16px] text-center">
						<div className="text-primary-500 font-bold text-2xl ">Signup</div>
						<div className="flex flex-col gap-[32px]">
								<FormProvider {...form} >
										<form onSubmit={form.handleSubmit(onSignup)}
													className="flex flex-col items-start justify-start gap-[24px] w-full">
												<div className="flex flex-col items-center justify-start gap-[16px] w-full">
														<RHFTextInput
																name="fullName"
																required
																fullWidth
																type="text"
																id="fullname"
																label="Full Name"
																size="small"
														/>
														<RHFTextInput
																name="username"
																required
																fullWidth
																type="text"
																id="username"
																label="Username"
																size="small"
														/>
														<RHFTextInput
																name="phoneNumber"
																required
																fullWidth
																type="tel"
																id="phonenumber"
																label="Phone Number"
																size="small"
														/>
														<RHFTextInput
																name="email"
																required
																fullWidth
																type="email"
																id="email"
																label="Email"
																size="small"
														/>
														<RHFPasswordInput
																name="password"
																required
																fullWidth
																type={showPassword ? "text" : "password"}
																id="password"
																label="Password"
																size="small"
														/>
														<RHFCheckbox name="consent"
																				 label={<span className="text-sm">I have read and consent to the <br/> <Link
																						 color="#008edd"
																						 className="text-primary-500 underline"
																						 href="/">privacy
																policy</Link></span>}/>
												</div>
												<LoadingButton loadingIndicator="Please Wait..." loading={form.formState.isSubmitting}
																			 type="submit" fullWidth
																			 className="bg-primary-500 rounded-full pointer text-white"
																			 variant="contained">
														Signup
												</LoadingButton>
										</form>
								</FormProvider>
								<div className="flex flex-col gap-[16px]">
										<Divider role="presentation" color="primary">
												OR
										</Divider>
										<Button className=" rounded-full pointer text-primary-500"
														variant="outlined" onClick={onLoginClicked}>
												Login
										</Button>
								</div>
						</div>
				</div>
		);
}

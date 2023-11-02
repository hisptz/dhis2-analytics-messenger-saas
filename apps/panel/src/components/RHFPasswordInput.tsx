import {IconButton, InputAdornment, TextFieldProps} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useBoolean} from "usehooks-ts";
import {RHFTextInput} from "@/components/RHFTextInput";


export interface RHFPasswordInput extends Omit<TextFieldProps, "helperText" | "error" | "variant"> {
		name: string;
}

export function RHFPasswordInput({name, label, ...props}: RHFPasswordInput) {
		const {value: showPassword, toggle} = useBoolean(false)

		return (
				<RHFTextInput
						{...props}
						label={label}
						type={showPassword ? "text" : "password"}
						InputProps={{
								endAdornment: (<InputAdornment position="end">
										<IconButton
												size="small"
												aria-label="toggle password visibility"
												onClick={toggle}
												onMouseDown={toggle}
										>
												{showPassword ? <VisibilityOff/> : <Visibility/>}
										</IconButton>
								</InputAdornment>)
						}}
						name={name}
				/>
		)
}

import {Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText} from "@mui/material";
import {useController} from "react-hook-form";
import React from "react"

export interface RHFCheckboxProps extends CheckboxProps {
		name: string;
		label: string | React.ReactNode;
}


export function RHFCheckbox({name, label, ...props}: RHFCheckboxProps) {
		const {fieldState, field} = useController({
				name
		})

		return (
				<FormControl error={!!fieldState.error}>
						<FormControlLabel control={<Checkbox  {...field} checked={field.value} {...props} />} label={label}/>
						{
								fieldState.error && (<FormHelperText>
										{fieldState.error?.message}
								</FormHelperText>)
						}
				</FormControl>
		)
}

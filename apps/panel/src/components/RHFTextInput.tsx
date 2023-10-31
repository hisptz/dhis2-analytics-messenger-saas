import {FieldValues, Path, useController} from "react-hook-form";
import {TextField, TextFieldProps} from "@mui/material";

export interface RHFTextInputProps extends Omit<TextFieldProps<"outlined">, "helperText" | "error" | "variant"> {
		name: string;
		helperText?: string;
}

export function RHFTextInput<T extends FieldValues>({name, helperText, ...props}: RHFTextInputProps) {
		const {field, fieldState} = useController<T>({
				name: name as Path<T>
		})
		const actualHelperText = fieldState.error ? fieldState.error.message : helperText;

		return (
				<TextField
						{...props}
						{...field}
						required
						fullWidth
						variant="outlined"
						error={!!fieldState.error}
						helperText={actualHelperText ?? ""}
				/>
		)
}

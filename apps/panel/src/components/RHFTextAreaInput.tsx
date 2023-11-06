import { FieldValues, Path, useController } from "react-hook-form";
import { TextareaAutosize, TextareaAutosizeProps } from "@mui/material";

export interface RHFTextInputProps
	extends Omit<TextareaAutosizeProps, "helperText" | "error" | "variant"> {
	name: string;
	helperText?: string;
}

export function RHFTextAreaInput<T extends FieldValues>({
	name,
	helperText,
	...props
}: RHFTextInputProps) {
	const { field, fieldState } = useController<T>({
		name: name as Path<T>,
	});
	const actualHelperText = fieldState.error
		? fieldState.error.message
		: helperText;

	return <TextareaAutosize {...props} {...field} required />;
}

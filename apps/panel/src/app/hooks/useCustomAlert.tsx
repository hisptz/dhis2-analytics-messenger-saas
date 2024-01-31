"use client";
import { useSnackbar, VariantType } from "notistack";
import Close from "@mui/icons-material/Close";

export type CustomAlertProps = {
	message: string;
	type: VariantType;
	autoHideDuration?: number;
};

export const useCustomAlert = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const show = ({ message, type, autoHideDuration }: CustomAlertProps) => {
		enqueueSnackbar(message, {
			variant: type,
			autoHideDuration,
			action: (key) => (
				<button
					onClick={() => closeSnackbar(key)}
					style={{ color: "white" }}
				>
					<Close></Close>
				</button>
			),
		});
	};

	return { show };
};

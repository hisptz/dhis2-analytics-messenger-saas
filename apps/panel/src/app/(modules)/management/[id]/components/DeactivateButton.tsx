import { LoadingButton } from "@mui/lab";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export interface DeactivateButtonProps {
	instance: Parse.Object;
	refetch: () => void;
}

export function DeactivateButton({ instance, refetch }: DeactivateButtonProps) {
	const enabled = useMemo(() => instance.get("enabled"), [instance]);
	const toggleActivation = async () => {
		return await instance.save({
			enabled: !instance.get("enabled"),
		});
	};

	const buttonStyles = enabled
		? {
				textTransform: "none",
				borderRadius: "50px",
				color: "GrayText",
		  }
		: {
				textTransform: "none",
				borderRadius: "50px",
				color: "",
		  };

	const { isPending, mutateAsync } = useMutation({
		mutationFn: toggleActivation,
		retry: false,
		mutationKey: [instance.id],
		onSuccess: () => {
			refetch();
		},
	});

	return (
		<LoadingButton
			className={`w-24 ${
				!enabled && "mt-4 transition-all duration-1000"
			}`}
			color={enabled ? "inherit" : "primary"}
			sx={buttonStyles}
			variant="outlined"
			onClick={() => mutateAsync()}
			loading={isPending}
		>
			{instance.get("enabled") ? "Deactivate" : "Activate"}
		</LoadingButton>
	);
}

import Parse from "parse";
import { WifiOff } from "@mui/icons-material";
import React from "react";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import { capitalize } from "lodash";

export function useWhatsAppConnectionStatus(data: Parse.Object) {
	const fetchStatus = async () => {
		const session = data.get("sessionId");
		const url = `${process.env.NEXT_PUBLIC_MESSAGING_URL}/clients/whatsapp/session/${session}/status`;
		const response = await fetch(url);

		return (await response.json()) ?? null;
	};

	return useSuspenseQuery({
		refetchOnWindowFocus: true,
		queryKey: ["whatsapp", data.id, "status"],
		queryFn: fetchStatus,
		refetchInterval: 2 * 60 * 1000,
		retryDelay: 2000,
		retry: (retries, error) => {
			if (retries > 10) return false;
			return true;
		},
	});
}

export function useManageWhatsappConnectionStatus(data: Parse.Object) {
	const session = data.get("sessionId");
	const baseUrl = `${process.env.NEXT_PUBLIC_MESSAGING_URL}/clients/whatsapp/session/${session}`;
	const queryClient = useQueryClient();

	const mutate = async (endpoint: string) => {
		const url = `${baseUrl}/${endpoint}`;
		const response = await fetch(url, {
			method: "POST",
		});
		return await response.json();
	};

	const { mutateAsync, isPending, error, isError } = useMutation({
		mutationKey: ["whatsapp", data.id, "status"],
		mutationFn: mutate,
		onSuccess: async () => {
			data.set("enabled", !data.get("enabled"));
			await data.save();
			await queryClient.invalidateQueries({
				queryKey: ["whatsapp", data.id],
			});
		},
	});

	const connect = async () => mutateAsync(`start`);
	const disconnect = async () => mutateAsync(`stop`);

	return {
		connect,
		disconnect,
		isPending,
		error,
		isError,
	};
}

export function WhatsAppConnectionStatus({ data }: { data: Parse.Object }) {
	const {
		isLoading,
		data: status,
		error,
		isError,
	} = useWhatsAppConnectionStatus(data);

	const {
		connect,
		disconnect,
		error: manageError,
		isError: hasManageError,
		isPending,
	} = useManageWhatsappConnectionStatus(data);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>{error?.message ?? ""}</div>;
	}

	if (status.status === "NOT_ACTIVE") {
		return (
			<div className="flex flex-row gap-4">
				<div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1 m-auto">
					<WifiOff color="error" sx={{ fontSize: 15 }} />
					<h1 className="">Disconnected</h1>
				</div>
				<LoadingButton
					color="success"
					onClick={connect}
					loadingIndicator={"Connecting"}
					loading={isPending}
					variant="text"
				>
					Connect
				</LoadingButton>
			</div>
		);
	}

	return (
		<div className="flex flex-row gap-4">
			<div className="text-green-800 bg-green-100 rounded-lg text-xs flex space-x-1 p-1 m-auto">
				<WifiOff color="success" sx={{ fontSize: 15 }} />
				<h1 className="">{capitalize(status.status)}</h1>
			</div>
			<LoadingButton
				color="error"
				onClick={disconnect}
				loadingIndicator={"Disconnecting"}
				loading={isPending}
				variant="text"
			>
				Disconnect
			</LoadingButton>
		</div>
	);
}

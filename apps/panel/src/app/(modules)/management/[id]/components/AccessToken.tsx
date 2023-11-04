import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Button from "@mui/material/Button";
import React from "react";
import Parse from "parse";
import { useCopyToClipboard } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { FullLoader } from "@/components/FullLoader";

export interface AccessTokenProps {
	instance: Parse.Object;
}

export function AccessToken({ instance }: AccessTokenProps) {
	const [, copy] = useCopyToClipboard();

	const fetchData = async () => {
		const query = new Parse.Query("AuthToken").equalTo(
			"dhis2Instance",
			instance,
		);
		return (await query.first()) ?? null;
	};

	const { data, isLoading, error, isError } = useQuery({
		queryFn: fetchData,
		queryKey: ["authToken", instance.id],
	});

	if (isLoading) {
		return <FullLoader />;
	}

	if (isError || error) {
		return <div>{error?.message}</div>;
	}

	return (
		<div className="flex flex-col gap-4">
			<Button
				onClick={() => {
					copy(data?.get("token"));
				}}
				className="font-bold text-xl"
				endIcon={<ContentCopyIcon />}
				sx={{
					textTransform: "none",
					fontWeight: "bold",
					fontSize: "inherit",
				}}
			>
				Copy Access Token
			</Button>
		</div>
	);
}

"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { WifiOff } from "@mui/icons-material";
import { useDHIS2Instance } from "@/app/(modules)/management/[id]/hooks/data";
import { FullLoader } from "@/components/FullLoader";
import { useRouter } from "next/navigation";
import InstanceModal from "@/app/(modules)/management/components/InstanceModal";
import { DeactivateButton } from "@/app/(modules)/management/[id]/components/DeactivateButton";

export default function InstanceDetail({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const { isLoading, data, refetch } = useDHIS2Instance(params.id);

	if (isLoading) {
		return <FullLoader />;
	}

	if (!data) {
		return <div>Instance not found</div>;
	}

	return (
		<div className="px-4">
			<Button
				startIcon={<ArrowBackIcon />}
				sx={{ textTransform: "none", paddingBottom: 2 }}
				variant="text"
				onClick={() => router.back()}
			>
				Back
			</Button>

			<div className="flex space-x-12 border-solid border-primary-300 p-4 border-[1px] rounded-lg">
				<div className="flex flex-col space-y-4 w-1/3">
					<div className="space-y-1">
						<div className="flex space-x-2">
							<span className="font-bold">Name:</span>
							<span>{data.get("name")}</span>
						</div>
						<div className="flex space-x-2">
							<span className="font-bold">DHIS2:</span>
							<a
								href={data.get("url")}
								className="text-primary-500 underline"
							>
								{data.get("url")}
							</a>
						</div>
						<div className="flex space-x-2 items-center">
							<span className="font-bold">Status:</span>
							<div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1">
								<WifiOff color="error" sx={{ fontSize: 15 }} />
								<h1 className="">Offline</h1>
							</div>
						</div>
						{data.get("enabled") && (
							<Button
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
						)}
					</div>
					<div className="flex space-x-4 ">
						<Button
							className="w-24"
							sx={{ textTransform: "none", borderRadius: "50px" }}
							variant="outlined"
							onClick={() => setOpenModal(true)}
						>
							Edit
						</Button>
						<DeactivateButton refetch={refetch} instance={data} />
						{openModal && (
							<InstanceModal
								defaultValue={data}
								open={openModal}
								onFormSubmit={() => setOpenModal(false)}
								onClose={() => setOpenModal(false)}
							/>
						)}
					</div>
				</div>

				<div className="flex flex-col w-2/3">
					<div className="font-bold mb-1 text-primary-500">
						Instance logs
					</div>
					<div className="p-4 bg-black text-white rounded-md space-y-2 overflow-auto h-96"></div>
				</div>
			</div>
		</div>
	);
}

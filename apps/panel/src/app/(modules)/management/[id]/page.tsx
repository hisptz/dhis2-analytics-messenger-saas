"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDHIS2Instance } from "@/app/(modules)/management/[id]/hooks/data";
import { FullLoader } from "@/components/FullLoader";
import { useRouter } from "next/navigation";
import InstanceModal from "@/app/(modules)/management/components/InstanceModal";
import { WhatsApp } from "@/app/(modules)/management/[id]/components/WhatsApp";
import { AccessToken } from "@/app/(modules)/management/[id]/components/AccessToken";

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
				<div className="flex flex-col space-y-4">
					<div className="space-y-1">
						<div className="flex space-x-2">
							<span className="font-bold">Name:</span>
							<span>{data.get("name")}</span>
						</div>
						<div className="flex">
							<span className="font-bold">DHIS2:</span>
							<a
								href={data.get("url")}
								className="text-primary-500 underline"
							>
								{data.get("url")}
							</a>
						</div>
						<WhatsApp instance={data} />
						<AccessToken instance={data} />
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
			</div>
		</div>
	);
}

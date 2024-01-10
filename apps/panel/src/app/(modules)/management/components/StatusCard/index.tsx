import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Parse from "parse";
import instanceLogo from "@/assets/group-5.svg";
import { useWhatsappClient } from "@/hooks/whatsapp";
import { WhatsAppConnectionStatus } from "@/app/(modules)/management/[id]/components/WhatsAppConnectionStatus";

export interface StatusCardProps {
	instance: Parse.Object;
}

export default function StatusCard({ instance }: StatusCardProps) {
	const router = useRouter();
	const { data } = useWhatsappClient(instance);

	const handleCardClick = () => {
		router.push(`/management/${instance.id}`);
	};

	return (
		<div
			className="m-4 flex space-x-4 p-4 px-8 rounded-lg border-solid border-grey-300 border-2 cursor-pointer"
			onClick={handleCardClick}
		>
			<Image src={instanceLogo} alt="Icon" width={80} height={80} />

			<div className="flex flex-col items-start space-y-1">
				<div className="text-gray-700 flex space-x-2">
					<span className="font-bold">Name:</span>
					<span className="text-primary-500">
						{instance.get("name")}
					</span>
				</div>

				<div className="text-gray-700 space-x-2">
					<span className="font-bold">DHIS2:</span>
					<a
						href={instance.get("url")}
						className="text-primary-500 underline"
					>
						{instance.get("url")}
					</a>
				</div>
				{data ? (
					<div className="flex items-center space-x-2">
						<span className="text-gray-700 font-bold">
							WhatsApp status:
						</span>
						<WhatsAppConnectionStatus
							hideControls
							whatsappClient={data}
						/>
					</div>
				) : (
					<div className="flex items-center space-x-2">
						<span className="text-gray-700 font-bold">
							WhatsApp status:
						</span>
						<span>Please wait</span>
					</div>
				)}
			</div>
		</div>
	);
}

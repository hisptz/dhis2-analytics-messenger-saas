"use client";
import { Button } from "@mui/material";
import { Add, ArrowForward } from "@mui/icons-material";
import DHIS2AnalyticsModal from "./components/InstanceModal";
import { FullLoader } from "@/components/FullLoader";
import { isEmpty } from "lodash";
import StatusCard from "@/app/(modules)/management/components/StatusCard";
import { useBoolean } from "usehooks-ts";
import { useDHIS2Instances } from "@/app/(modules)/management/hooks/data";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const router = useRouter();
	const {
		value: modalHidden,
		setTrue: hideModal,
		setFalse: showModal,
	} = useBoolean(true);

	const { isLoading, results, refetch } = useDHIS2Instances();

	const onInstanceAdd = () => {
		hideModal();
		refetch();
	};

	if (isLoading) {
		return <FullLoader />;
	}
	if (isEmpty(results)) {
		return (
			<div className=" bg-white h-screen flex w-full">
				<div className="flex flex-col items-start justify-start text-2xl text-primary-500 w-full">
					<div className="text-left font-bold">
						Instances Management
					</div>
					<div className=" flex flex-col items-center justify-center w-full py-6 px-auto gap-[64px] text-sm text-black font-m3-label-large">
						<h1>
							There are no DHIS2 analytics messenger instances
							created. Get started below!
						</h1>
						<Button
							className="bg-primary-500 cursor-pointer"
							color="primary"
							sx={{ textTransform: "none", borderRadius: "50px" }}
							variant="contained"
							endIcon={<ArrowForward />}
							onClick={showModal}
						>
							Get Started
						</Button>
						{!modalHidden && (
							<DHIS2AnalyticsModal
								open={!modalHidden}
								onClose={hideModal}
								onFormSubmit={onInstanceAdd}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className=" flex">
			<div className="flex flex-col items-start justify-start text-primary-500 w-full">
				<h1 className="text-left font-bold text-2xl mb-2">
					Instances Management
				</h1>
				<Button
					className="bg-primary-500 cursor-pointer"
					color="primary"
					sx={{
						textTransform: "none",
						borderRadius: "50px",
						fontSize: 15,
						paddingX: 3,
					}}
					variant="contained"
					startIcon={<Add />}
					onClick={showModal}
				>
					Add Instance
				</Button>
				{!modalHidden && (
					<DHIS2AnalyticsModal
						open={!modalHidden}
						onClose={hideModal}
						onFormSubmit={onInstanceAdd}
					/>
				)}
				<div className="flex flex-row  w-full py-6 px-auto gap-[16px] text-sm text-black font-m3-label-large">
					{results?.map((instance) => (
						<StatusCard
							key={`${instance.id}-card`}
							instance={instance}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

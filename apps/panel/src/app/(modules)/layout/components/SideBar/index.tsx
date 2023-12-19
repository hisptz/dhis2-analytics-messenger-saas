"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ParseClient } from "@/utils/parse/client";
import Image from "next/image";
import { LogoutModal } from "../logout";
import { Box, Tab, Tabs } from "@mui/material";
import NextLink from "next/link";
import logo from "@/assets/analyticsmessenger-11@2x.png";

import dashboard from "@/assets/precision-manufacturing.svg";
import account from "@/assets/person.svg";
import logout from "@/assets/logout.svg";
import { useCookies } from "react-cookie";
import { useUserIsAdmin } from "@/app/hooks/user";
import { People } from "@mui/icons-material";

interface SidebarTabProps {
	href?: string;
	src?: string;
	icon?: React.ReactNode;
	label: string;
	onClick?: () => void;
}

const SidebarTab: React.FC<SidebarTabProps> = ({
	href,
	src,
	label,
	onClick,
	icon,
	...props
}) => (
	<Tab
		component={href ? NextLink : "div"}
		href={href}
		onClick={onClick}
		icon={
			<div className="flex items-center gap-2.5 justify-start">
				{src ? (
					<Image
						className="w-6 h-6"
						alt=""
						src={src}
						width={24}
						height={24}
					/>
				) : (
					icon
				)}
				<span>{label}</span>
			</div>
		}
		sx={{
			"justifyContent": "flex-start",
			"&.Mui-selected": {
				backgroundColor: "rgba(0, 142, 221, 0.25)",
			},
			"textTransform": "none",
		}}
		{...props}
	/>
);

export default function SideBar() {
	const [, , removeCookie] = useCookies(["sessionToken"]);
	const { data: userIsAdmin, isLoading: userIsAdminLoading } =
		useUserIsAdmin();
	const router = useRouter();
	const [isLogOutModalOpen, setLogOutModalOpen] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const openLogOutModal = useCallback(() => {
		setLogOutModalOpen(true);
	}, []);
	const closeLogOutModal = useCallback(() => {
		setLogOutModalOpen(false);
	}, []);
	const onLogOut = useCallback(async () => {
		setLoggingOut(true);
		try {
			await ParseClient.User.logOut();
			removeCookie("sessionToken");
			setLogOutModalOpen(false);
			router.replace("/login");
		} catch (error: any) {
			alert(error.message);
		}
		setLoggingOut(false);
	}, [router]);
	const pathname = usePathname();
	const [tabValue, setTabValue] = useState<number>(() => {
		switch (pathname) {
			case "/dashboard":
				return 0;
			case "/account":
				return 1;
			default:
				return 0;
		}
	});
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		if (newValue === 2) openLogOutModal();
	};

	if (userIsAdminLoading) {
		return <span>Please wait...</span>;
	}

	return (
		<>
			<nav className="bg-m3-sys-light-on-primary w-24 h-screen text-left text-sm text-primary-500 font-lalezar mr-32 flex-shrink-0">
				<div className="h-full w-56 border-r border-primary-200 flex flex-col [backdrop-filter:blur(500px)]  [background:linear-gradient(#f5f5f5,_#f5f5f5),_#fff]">
					<div className="flex items-end justify-start py-3 px-1 gap-2.5 border-b border-yellow-400">
						<Image
							className="w-10 h-10 object-cover"
							alt="DHIS2 icon"
							src={logo}
							width={40}
							height={40}
						/>
						<div>
							<p className="m-0 font-bold">DHIS2</p>
							<p className="m-0 font-bold">Analytics Messenger</p>
						</div>
					</div>
					<Box sx={{ flexGrow: 1, display: "flex", marginTop: 1 }}>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							orientation="vertical"
							variant="standard"
							textColor="primary"
							indicatorColor="primary"
							sx={{
								"width": "14rem",
								"& .MuiTabs-indicator": {
									left: 0,
									right: "auto",
									width: "4px",
									backgroundColor: "primary-500",
									transition: "none",
								},
							}}
						>
							{userIsAdmin && (
								<SidebarTab
									href="/users"
									icon={<People />}
									label="Users"
								/>
							)}
							{!userIsAdmin && (
								<SidebarTab
									href="/management"
									src={dashboard}
									label="Management"
								/>
							)}
							<SidebarTab
								href="/account"
								src={account}
								label="Account"
							/>
							<SidebarTab
								src={logout}
								label="Logout"
								onClick={openLogOutModal}
							/>
						</Tabs>
					</Box>
				</div>
			</nav>
			{isLogOutModalOpen && (
				<LogoutModal
					loading={loggingOut}
					open={isLogOutModalOpen}
					onClose={closeLogOutModal}
					onLogOut={onLogOut}
				/>
			)}
		</>
	);
}

"use client";
import React from "react";
import type { NextPage } from "next";
import ImageCarousel from "./Carousel";
import { usePathname } from "next/navigation";
import { Card } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/analyticsmessenger-11@2x.png";

type LoginFormContainerType = {
	children: React.ReactNode;
};

const AuthContainer: NextPage<LoginFormContainerType> = ({ children }) => {
	const pathname = usePathname();
	const showSignUp = pathname.includes("signup");

	const carouselDivStyle = {
		transform: showSignUp ? "translateX(100%)" : "translateX(0)",
		transition: "transform 0.5s ease-in-out",
	};

	const formDivStyle = {
		transform: showSignUp ? "translateX(-100%)" : "translateX(0)",
		transition: "transform 0.5s ease-in-out",
	};

	return (
		<Card
			style={{
				height: 640,
				width: 800,
				position: "absolute",
				left: "50%",
				top: "50%",
				transform: "translate(-50%, -50%)",
			}}
		>
			<div className="h-full w-full flex flex-row justify-between relative">
				<div
					style={{
						height: 72,
						width: 72,
						top: 0,
						left: 400 - 36, //
						background: "white",
						position: "absolute",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 4,
						zIndex: 10,
					}}
				>
					<Image alt="logo" height={56} width={56} src={logo} />
				</div>
				<div
					style={carouselDivStyle}
					className="flex-1 flex flex-col bg-yellow-400 justify-center items-center h-full min-h-[80%]"
				>
					<div
						style={{
							background:
								"linear-gradient(180deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.20) 100%)",
						}}
						className="flex flex-col items-center justify-start box-border gap-[24px] rounded-lg p-4"
					>
						<div className="relative inline-block w-[300px] text-primary-500">
							<p className="m-0 font-medium">Welcome to</p>
							<p className="m-0 text-[24px] text-center font-[700]">
								DHIS2 Analytics Messenger
							</p>
						</div>
						<div className="relative text-center text-base text-primary-500 font-m3-label-large">
							<ImageCarousel />
						</div>
					</div>
				</div>
				<div
					style={formDivStyle}
					className="flex-1 h-full flex flex-col items-center justify-center bg-white"
				>
					{children}
				</div>
			</div>
		</Card>
	);
};

export default AuthContainer;

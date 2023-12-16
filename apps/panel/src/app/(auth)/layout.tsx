import Image from "next/image";
import React from "react";
import AuthContainer from "@/app/(auth)/components/AuthContainer";
import vector from "@/assets/vector.svg";
import hispLogo from "@/assets/hisptzlogo@2x.png";
import dhis2Logo from "@/assets/dhis2logo@2x.png";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className=" bg-primary-500 w-screen h-screen  text-center text-[18px] text-primary-500 font-m3-label-large">
			<div className="absolute inset-0">
				<Image
					className="absolute h-full w-screen object-cover"
					alt="Background Vector Image"
					src={vector}
					width={1920}
					height={1080}
				/>
				<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-row items-center justify-center gap-[10px]">
					<Image
						className="relative w-[75px] h-[75px] object-cover"
						alt=""
						src={hispLogo}
						width={75}
						height={75}
					/>
					<div>
						<span>{`Developed by `}</span>
						<i className="font-bold">{`HISP Tanzania, `}</i>
						<span>Powered by</span>
						<i className="font-bold"> DHIS2</i>
					</div>
					<Image
						className="relative w-[75px] h-[75px] object-cover"
						alt=""
						src={dhis2Logo}
						width={75}
						height={75}
					/>
				</div>
			</div>
			<AuthContainer>{children}</AuthContainer>
		</div>
	);
}

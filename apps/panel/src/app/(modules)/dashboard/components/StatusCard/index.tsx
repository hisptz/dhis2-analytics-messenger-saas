import React from "react";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import Image from "next/image";
import { Wifi } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function StatusCard() {
  const router = useRouter();

  
  const handleCardClick = () => {
    router.push('/dashboard/management/instance'); 
  };

  return (
    <div className=" m-4 flex space-x-4 p-4 px-8 rounded-lg border-solid border-grey-300 border-2 cursor-pointer" onClick={handleCardClick}>
      <Image src="/group-5.svg" alt="Icon" width={80} height={80} />

      <div className="flex flex-col items-start space-y-1">
        <div className="text-gray-700 flex space-x-2">
          <span className="font-bold">Name:</span>
          <span className="text-primary-500">RHMCAH Tanzania</span>
        </div>

        <div className="text-gray-700 space-x-2">
          <span className="font-bold">DHIS2:</span>
          <a href="https://rmncah.org.tz" className="text-primary-500 underline">https://rmncah.org.tz </a>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-bold">Status:</span>

          <div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1">
            <WifiOffIcon color="error" sx={{ fontSize: 15 }} />
            <h1 className="">Offline</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

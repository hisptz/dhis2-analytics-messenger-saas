"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Wifi, WifiOff } from "@mui/icons-material";
import DHIS2AnalyticsModal from "./DHIS2AnalyticsInstance";

export default function InstanceDetail () {
  const [openModal, setOpenModal] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };
  const buttonStyles = isActive 
    ? { 
        textTransform: "none", 
        borderRadius: "50px", 
        color: "GrayText" 
      } 
    : { 
        textTransform: "none", 
        borderRadius: "50px", 
        color: "",
      };
  return (
    <div className="px-4">
      <Button startIcon={<ArrowBackIcon />} sx={{textTransform:'none' , paddingBottom:2}} variant="text" href="/dashboard/management">
        Back
      </Button>

      <div className="flex space-x-12 border-solid border-primary-300 p-4 border-[1px] rounded-lg">
        <div className="flex flex-col space-y-4 w-1/3">
          <div className="space-y-1">
            <div className="flex space-x-2">
              <span className="font-bold">Name:</span>
              <span>HMIS Tanzania</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-bold">DHIS2:</span>
              <a
                href="https://dhis2.org.tz"
                className="text-blue-500 underline"
              >
                https://dhis2.org.tz
              </a>
            </div>
            <div className="flex space-x-2 items-center">
              <span className="font-bold">Status:</span>
              <div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1">
                <WifiOff color="error" sx={{ fontSize: 15 }} />
                <h1 className="">Offline</h1>
              </div>
            </div>
            {isActive && (
              <Button
                className="font-bold text-xl"
                endIcon={<ContentCopyIcon />}
                sx={{ textTransform: "none", fontWeight: 'bold', fontSize: 'inherit' }}
              >
                Copy Access Token
              </Button>
            )}
          </div>
          <div className="flex space-x-4 ">
            <Button
              className="w-24"
              sx={{ textTransform: "none", borderRadius: "50px"}}
              variant="outlined"
              onClick={() => setOpenModal(true)}
            >
              Edit
            </Button>
            <Button
              className={`w-24 ${!isActive && 'mt-4 transition-all duration-1000'}`}  
              color={isActive ? "inherit" : "primary"}
              sx={buttonStyles}
              variant="outlined"
              onClick={toggleActiveStatus}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
            {openModal && (
            <DHIS2AnalyticsModal 
          open={openModal} 
          onClose={() => setOpenModal(false)}
        />
      )}
          </div>
        </div>
        
        <div className="flex flex-col w-2/3">
          <div className="font-bold mb-1 text-primary-500">Instance logs</div>
          <div className="p-4 bg-black text-white rounded-md space-y-2 overflow-auto h-96">
           
          </div>
        </div>
      </div>
    </div>
  );
};



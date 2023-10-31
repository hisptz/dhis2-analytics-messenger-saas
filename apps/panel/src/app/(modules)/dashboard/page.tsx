"use client";
import { Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import DHIS2AnalyticsModal, { InstanceData } from "./components/InstanceModal";
import { useState } from "react";
import QRCodeModal from "./components/QRCodeModal";

export default function Dashboard() {
  const [openInstanceModal, setOpenInstanceModal] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrValue, setQrValue] = useState(''); 

  const handleFormSubmit = (instanceData:InstanceData) => {
    setQrValue(instanceData.dhis2Instance); 
    setOpenInstanceModal(false);
    setOpenQRModal(true);
  };
  return (
    <div className=" bg-white h-screen flex">
      <div className="flex flex-col items-start justify-start p-3   text-2xl text-primary-500 w-full">
        <div className="text-left font-bold">Instances Management</div>
        <div className=" flex flex-col items-center justify-center w-full py-6 px-auto gap-[64px] text-sm text-black font-m3-label-large">
          <h1>
            There are no DHIS2 analytics messenger instances created. Get
            started below!
          </h1>
          <Button
            className="bg-primary-500 cursor-pointer"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "50px" }}
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => setOpenInstanceModal(true)}
          >
            Get Started
          </Button>
          {openInstanceModal && (
        <DHIS2AnalyticsModal 
          open={openInstanceModal} 
          onClose={() => setOpenInstanceModal(false)} 
          onFormSubmit={handleFormSubmit}
        />
      )}
      {openQRModal && (
        <QRCodeModal 
          open={openQRModal} 
          onClose={() => setOpenQRModal(false)} 
          qrValue={qrValue}
        />
      )}
        </div>
      </div>
    </div>
  );
}


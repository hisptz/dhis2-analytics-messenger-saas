"use client";
import { Button } from "@mui/material";
import { Add, ArrowForward } from "@mui/icons-material";
import { useState } from "react";
import DHIS2AnalyticsModal from "../components/InstanceModal";
import StatusCard from "../components/StatusCard";

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className=" flex">
      <div className="flex flex-col items-start justify-start p-3    text-primary-500 w-full">
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
          onClick={() => setOpenModal(true)}
        >
          Add Instance
        </Button>
        {openModal && ( <DHIS2AnalyticsModal open={openModal} onClose={() => setOpenModal(false)}  /> )}
        <div className=" flex flex-row items-center  w-full py-6 px-auto gap-[64px] text-sm text-black font-m3-label-large">
          <div><StatusCard/></div>
        </div>
      </div>
    </div>
  );
}

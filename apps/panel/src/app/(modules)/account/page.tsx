"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import EditDetailsModal from "./components/EditDetaisModal";
import ChangePasswordModal from "./components/PasswordModal";

export default function Account() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex-col items-start justify-start p-3 text-left ">
        <h1 className="text-2xl  text-primary-500 font-lalezar font-bold">
          Account
        </h1>
        <div className="w-full bg-m3-sys-light-on-primary p-6 border border-cornflowerblue-200 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-lg font-medium text-white">A</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-black">
              <label>Username:</label>
              <b className="text-primary-500">d2Analytics</b>
              <label>Email:</label>
              <span className="text-primary-500">test@mail.com</span>
            </div>
          </div>
          <div className="flex items-start gap-4 mt-10">
            <Button
              variant="outlined"
              className="text-primary-500"
              sx={{ textTransform: "none", borderRadius: "50px" }}
              onClick={() => setEditModalOpen(true)}
            >
              Edit details
            </Button>
            <Button
              variant="outlined"
              className="text-primary-500"
              sx={{ textTransform: "none", borderRadius: "50px" }}
              onClick={() => setPasswordModalOpen(true)}
            >
              Change Password
            </Button>
            <EditDetailsModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
            />
            <ChangePasswordModal
              open={passwordModalOpen}
              onClose={() => setPasswordModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

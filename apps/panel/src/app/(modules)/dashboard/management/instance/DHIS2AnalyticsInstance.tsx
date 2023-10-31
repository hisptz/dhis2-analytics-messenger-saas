import React, {useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions,
  Button
} from '@mui/material';
import { RHFTextInput } from '@/components/RHFTextInput';
import  {FormProvider, useForm} from 'react-hook-form';
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

interface DHIS2AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
}

const instanceSchema = z.object({
  name: z.string({required_error: "Username is required"}),
  dhis2Instance: z.string({required_error: "DHIS2 Instance is required"}).url(),
  dhis2AccessToken:z.string({required_error: "AccessToken is required"}),
})

export type InstanceData = z.infer<typeof instanceSchema>;

const DHIS2AnalyticsModal: React.FC<DHIS2AnalyticsModalProps> = ({ open, onClose}) => {
  const handleOpen = async (data: InstanceData)  => {
  
    console.log("here is", data); 
  };
  const form = useForm<InstanceData>({
    resolver: zodResolver(instanceSchema)
  });      


  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-dhis2instance"
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-instance" style={{marginBottom:-30}}>DHIS2 Analytics Instance</DialogTitle>
      <FormProvider {...form} >
        <form onSubmit={form.handleSubmit(handleOpen)}>
      <DialogContent>
      
        <RHFTextInput
          autoFocus
          name="name"
          margin="dense"
          label="Name"
          type="text"
          placeholder="HMIS Tanzania"
        />
        <RHFTextInput
          name="dhis2Instance"
          margin="dense"
          label="DHIS2 Instance"
          type="url"
          placeholder="https://dhis2.org.tz"
        />
        <RHFTextInput
          name="dhis2AccessToken"
          margin="dense"
          label="DHIS2 Access Token"
          type="text"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        />
       
      </DialogContent>
      <DialogActions>
        <Button
          className="text-black w-24"
          sx={{ textTransform: "none", borderRadius: "50px" }}
          onClick={onClose}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          className="rounded-full bg-primary-500 w-24"
          color="primary"
          sx={{ textTransform: "none", borderRadius: "50px" }}
          variant="contained"
         type="submit"
        >
          Save
        </Button>
      </DialogActions>
      
      </form>
      </FormProvider>

    </Dialog>
  );
};

export default DHIS2AnalyticsModal;

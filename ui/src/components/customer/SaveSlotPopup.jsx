import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {auth} from '../../firebase.js';
import axios from 'axios';
import {useMemo, useState} from "react";

const serverHost = "http://localhost:5001";

export default function SaveSlotPopup({open,toast,setRefreshCounter, setOpen, selectedSlotData, setSelectedSlotData}) {
    const [textFieldValue, setTextFieldValue] = useState("");
    const formatEventTime = (date) =>{
        const options = {
            timeZone: 'Asia/Jerusalem',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return date.toLocaleTimeString('en-GB', options);
    }

    const formatEventDate = (date) =>{
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    const handleClose = () => {
        setSelectedSlotData({});
        setOpen(false);
    };

    const capitalOwnerName = useMemo(()=>{
        return `${selectedSlotData.ownerName[0].toUpperCase()}${selectedSlotData.ownerName.slice(1)}`
    }, [selectedSlotData.ownerName])

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: async(event) => {
                        event.preventDefault();
                        const eventToAdd = {
                            title: textFieldValue,
                            start: selectedSlotData.start.toISOString(),
                            end: selectedSlotData.end.toISOString(),
                            clientId:auth?.currentUser?.uid,
                            ownerId:selectedSlotData.ownerId
                        };
                        const postEvent = axios.post(`${serverHost}/events`, eventToAdd, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        await toast.promise(
                            postEvent,
                            {
                                pending: 'Scheduling your event',
                                success: 'Successfully saved!',
                                error: 'Failed to save your event'
                            }
                        )
                        handleClose();
                        setRefreshCounter(prev=>{
                            return prev+1;
                        })
                    }
                }}
            >
                <DialogTitle>Schedule Slot</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`You are about to book a meeting with ${capitalOwnerName} on ${formatEventDate(selectedSlotData.start)} at ${formatEventTime(selectedSlotData.start)} - ${formatEventTime(selectedSlotData.end)}`}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Name of your meeting"
                        fullWidth
                        variant="standard"
                        onChange={(event)=>{
                            setTextFieldValue(event?.currentTarget?.value);
                        }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

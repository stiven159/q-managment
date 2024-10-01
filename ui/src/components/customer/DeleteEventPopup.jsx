import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import {toast} from "react-toastify";
const serverHost = "http://localhost:5001";
export default function DeleteEventPopup({setRefreshCounter, deleteEventData, setDeleteEventData, setOpenDeletePopup, openDeletePopup}) {


    const handleClose = () => {
        setOpenDeletePopup(false);
        setDeleteEventData({});
    };

    const deleteEvent = async(eventId) =>{
        const deleteEventPromise = axios.delete(`${serverHost}/events/${eventId}`);
        await toast.promise(
            deleteEventPromise,
            {
                pending: 'Delete your event',
                success: 'Successfully deleted!',
                error: 'Failed to delete your event'
            }
        )
        handleClose();
        setRefreshCounter(prev=>{
            return prev+1;
        })
    }

    return (
        <React.Fragment>
            <Dialog
                open={openDeletePopup}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Meeting From Calander"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure you want to delete your meeting with ${deleteEventData.ownerName}` }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={async()=>{
                        await deleteEvent(deleteEventData.eventId)
                    }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Grid from '@mui/material/Grid';
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from '../../firebase.js';
import { clsx } from 'clsx';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import SaveSlotPopup from "./SaveSlotPopup.jsx";
import { ToastContainer, toast } from 'react-toastify';
import DeleteEventPopup from "./DeleteEventPopup.jsx";
import Modal from "../owner/ModalPop.jsx"
// eslint-disable-next-line react/prop-types
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import { css } from "@emotion/css";
import {useEffect, useState} from "react";
import axios from "axios";

const localizer = momentLocalizer(moment);

const styles = {
  divider: css({
    width: "100%",
    height: "2px",
    backgroundColor: "rgba(239, 239, 239, 1)"
  }),
  listItem: css({
    backgroundColor: "none",
    "&:hover": {
      backgroundColor: "rgba(51, 128, 255, 0.1)",
      cursor: "pointer"
    },
      maxWidth:"350px"
  }),
    selectedListItem: css({
        backgroundColor: "rgba(51, 128, 255, 0.5)",
        "&:hover": {
            backgroundColor: "rgba(51, 128, 255, 0.5)",
        },
    }),
  mainContainer: css({
    display: "flex",
    width: "100%"

  }),
    listItemText:css({
        overflow:"hidden",
        textOverflow:"ellipsis"
    }),
    event: css({
        cursor: 'grab'
    })
};


const OwnerItem = ({ item, selectedOwner="", setSelectedOwner }) => {
    const isSelected = selectedOwner === item._id
    const mixedStyles = clsx(styles.listItem, isSelected ? styles.selectedListItem : null);
  return (
    <>
      <ListItem
        alignItems="flex-start"
        classes={{ root: mixedStyles }}
        onClick={() => {
          setSelectedOwner(item._id);
        }}
      >
        <ListItemText
            classes={{secondary:styles.listItemText}}
          sx={{ textAlign: "right", paddingRight: "4px", whiteSpace: "nowrap", overflow:"hidden", textOverflow:"ellipsis" }}
          primary={item.name}
          secondary={<React.Fragment>{item.description}</React.Fragment>}
        />
        <ListItemAvatar>
          <Avatar src={item.avatar} />
        </ListItemAvatar>
      </ListItem>
      <div className={styles.divider}></div>
    </>
  );
};


export default function OwnerList() {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [ownersEvents, setOwnersEvents] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState({});
  const navigate = useNavigate();
  const [calanderView, setCalanderView] = useState("month");
  const [deleteEventData, setDeleteEventData] = useState({});
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  useEffect(() => {
      fetch("http://localhost:5001/owners").then(r=>{
        r.json().then(res=>{
          setOwners(res);
        })
      })
  }, []);

    useEffect(() => {
        if (selectedOwner){
            axios(`http://localhost:5001/events/${selectedOwner}`, {
                headers: {
                    Authorization:`Bearer ${auth.currentUser.accessToken}`
                }
            })
                .then(res=>{
                    const mappedEvents = (res.data || []).map(event=>{
                        return {
                            ...event,
                            start: new Date(event.start),
                            end: new Date(event.end),
                        }
                    })
                    setOwnersEvents(mappedEvents);
                });
        }
    }, [selectedOwner, refreshCounter]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');  // Redirect to root if user is not logged in
            }
        });

        return () => unsubscribe();  // Cleanup subscription on unmount
    }, [navigate]);


    const onSelectSlot = ({start,end}) =>{
        if (!selectedOwner){
            toast.warn("Please select owner before trying to schedule a meeting", {
                position: "top-center"
            });
            return;
        }
        if(calanderView === 'month'){ // when click on a day in month display we can't select times so we ignore this and do not allow to add event for month display
            return;
        }

        const fullSelectedOwner = (owners || []).find(owner=>owner._id === selectedOwner || "");
        setSelectedSlotData({
            start,
            end,
            ownerId: fullSelectedOwner?._id || "",
            ownerName: fullSelectedOwner?.name || ""
        })
        setOpenPopup(true);
    }

    const CustomEvent = (eventData) =>{
        return (
            <div className={styles.event}>{eventData.title}</div>
        )
    }


    return (
    
        <div>
            <button className="create-business-button"><Modal/></button>
            <ToastContainer
                style={{width: "350px"}}
                position={"top-center"}
                pauseOnHover={false}
                autoClose={5000}
          />
            <DeleteEventPopup setRefreshCounter={setRefreshCounter} openDeletePopup={openDeletePopup} setOpenDeletePopup={setOpenDeletePopup} deleteEventData={deleteEventData} setDeleteEventData={setDeleteEventData}/>
          {selectedSlotData.start && <SaveSlotPopup setRefreshCounter={setRefreshCounter} toast={toast} open={openPopup} setOpen={setOpenPopup} selectedSlotData={selectedSlotData} setSelectedSlotData={setSelectedSlotData}/>}
          <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                  <Grid item xs={9}>
                      <div style={{border: "1px solid black", width: "100%", height: "100%"}}>
                          <Calendar
                              localizer={localizer}
                              events={ownersEvents}
                              startAccessor="start"
                              endAccessor="end"
                              style={{height: 500}}
                              selectable
                              onSelectSlot={onSelectSlot}
                              views={{
                                  month:true,
                                  week:true,
                                  day:true,
                                  agenda:true
                              }}
                              defaultView={"month"}
                              onView={(newView)=>setCalanderView(newView)}
                              onSelectEvent={async(clickedEvent)=>{
                                  if (!clickedEvent.clientId){
                                      return;
                                  }
                                  setOpenDeletePopup(true);
                                  const owner = owners.find(owner=>owner._id === selectedOwner);
                                  if (!owner){
                                      return;
                                  }
                                  setDeleteEventData({
                                      ownerName:`${owner.name[0].toUpperCase()}${owner.name.slice(1)}`,
                                      eventId:clickedEvent._id
                                  })

                                  // await deleteEvent(a._id)
                              }}
                              popup
                              components={{
                                  event:CustomEvent
                              }}

                          />
                      </div>
                  </Grid>
                  <Grid item xs={3}>
                      <List sx={{
                          maxHeight: "95%",
                          right: "8px",
                          overflowY: "scroll",
                          border: "1px solid black"
                      }}>
                          {owners.map((owner) => {
                              return <OwnerItem key={owner._id} item={owner} selectedOwner={selectedOwner}
                                                setSelectedOwner={setSelectedOwner}/>;
                          })}
                      </List>
                  </Grid>
              </Grid>

          </Box>
      </div>


  );
}

import React, { useState } from "react";
import Card from "./Card";
import businessOwnerImage from "../imgas/business-owner.png";
import customerImag from "../imgas/customer.png";
import app from "../imgas/app-imag.png";
import { Router, Link } from "react-router-dom";
export default function Open() {
  return (
    <>
      <Card
        name="לקוח"
        text="אתם יכולים ליהנות משימוש נוח ופשוט באפליקציה זו. תוכלו לקבוע תורים מראש, לקבל תזכורות לפגישות, ולקבל עדכונים על זמינות תורים בזמן אמת."
        img={customerImag}
        link="/login"
      />
      {/* <Card
        text=" ניהול התורים שלכם מפשט ומקל עליכם את העבודה. יכולתם ליצור ולנהל תורים, לקבוע זמני הפעלה, ולעקוב אחרי הלקוחות שלכם בקלות מוחלטת."
        link="/login"
        img={businessOwnerImage}
        name="בעל עסק"
      /> */}
      <Card text=" Our Application שלנו" img={app} />
      <Card text="Welcome Q-managment" />
    </>
  );
}

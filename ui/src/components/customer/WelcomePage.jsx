import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import HelloImage from "../../assets/hello-image.png";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const userName = "Omri Terem";

const WelcomePage = (props) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "50%",
        margin: "auto",
        border: "1px solid grey",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        background: "#08596A",
      }}
    >
      <div style={{ height: "auto", objectFit: "fill" }}>
        <img src={HelloImage} width={"100%"} height={200} />
      </div>
      <div
        style={{
          width: "50%",
          margin: "auto",
          textAlign: "center",
          marginTop: 10,
          marginBottom: 10,
          fontWeight: 600,
          fontSize: "20px",
          backgroundColor: "#f4f4f4",
          lineHeight: 1.2,
          borderRadius: "4px",
        }}
      >
        Hello {userName}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "center",
          paddingBottom: "40px",
          paddingTop: "20px",
        }}
      >
        <Button
          sx={{ background: "black", width: "fit-content" }}
          variant="contained"
        >
          {" "}
          צפייה בתורים שלי
        </Button>

        <Button
          sx={{ background: "black", width: "fit-content" }}
          variant="contained"
          onClick={() => {
            navigate("/owners");
          }}
        >
          {" "}
          קביעת תור
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;

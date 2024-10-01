import React from "react";
// import "../style.css";
import { Router,Link } from "react-router-dom";
import "../Css.Style.css"
function Card(props) {
  return (
    <div className="card-container">
      <h1>{props.title}</h1>
      <Link to={props.link}>
      {props.name && <button className="bt-card">{props.name}</button>}
      </Link>
      <span className="text-card">{props.text}</span>
      <img src={props.img}/>
    </div>
     
  );
}

export default Card;

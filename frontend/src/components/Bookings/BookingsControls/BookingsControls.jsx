import React from "react";

import "./BookingsControls.css";

const BookingsControls = (props) => {
  return (
    <div className="bookings-control">
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={() => props.onChange("list")} // Using arrow function instead of bind
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={() => props.onChange("chart")} // Using arrow function instead of bind
      >
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;

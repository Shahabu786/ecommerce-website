import React from "react";
import Icon from "./Icon";

export default function TopBar({}) {
  return (
    <>
      <div className="top-bar">

        <div>
          Welcome to Tech-Nest
        </div>

        <div className="top-links">

          <span><Icon name="map-pin" /> Deliver to 226021</span>

          <span><Icon name="truck" /> Track your order</span>

          <span><Icon name="tag" /> All Offers</span>

        </div>

      </div>
    </>
  );
}

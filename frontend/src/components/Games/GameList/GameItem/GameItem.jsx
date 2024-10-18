import React from "react";

import "./GameItem.css";

const GameItem = ({
  gameId,
  title,
  price,
  date,
  userId,
  creatorId,
  onDetail,
}) => (
  <li key={gameId} className="game__list-item">
    <div>
      <h1>{title}</h1>
      <h2>
        ${price} - {new Date(date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {userId === creatorId ? (
        <p>You are the owner of this game.</p>
      ) : (
        <button className="btn" onClick={() => onDetail(gameId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default GameItem;

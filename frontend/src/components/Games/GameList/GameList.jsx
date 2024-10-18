import React from "react";

import GameItem from "./GameItem/GameItem";
import "./GameList.css";

const gameList = ({ games, authUserId, onViewDetail }) => {
  const gameItems = games.map((game) => (
    <GameItem
      key={game._id}
      gameId={game._id}
      title={game.title}
      price={game.price}
      date={game.date}
      userId={authUserId}
      creatorId={game.creator._id}
      onDetail={onViewDetail}
    />
  ));

  return <ul className="game__list">{gameItems}</ul>;
};

export default gameList;

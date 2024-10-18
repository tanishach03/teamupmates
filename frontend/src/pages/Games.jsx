import React, { useState, useEffect, useRef, useContext } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import GameList from "../components/Games/GameList/GameList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import "./Games.css";

const GamesPage = () => {
  const [creating, setCreating] = useState(false);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const authContext = useContext(AuthContext);

  const titleElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();

  // Track if the component is active to handle state updates only when necessary
  let isActive = true;

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
    return () => {
      isActive = false;
    };
  }, []);

  // Handle the start of creating a new game
  const startCreateGameHandler = () => {
    setCreating(true);
  };

  // Confirm and create the game with the provided input
  const modalConfirmHandler = () => {
    setCreating(false);

    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const game = { title, price, date, description };
    console.log(game);

    const requestBody = {
      query: `
        mutation CreateGame($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createGame(gameInput: {title: $title, description: $desc, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date,
      },
    };

    const token = authContext.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed to create game!");
        }
        return res.json();
      })
      .then((resData) => {
        setGames((prevGames) => [
          ...prevGames,
          {
            _id: resData.data.createGame._id,
            title: resData.data.createGame.title,
            description: resData.data.createGame.description,
            date: resData.data.createGame.date,
            price: resData.data.createGame.price,
            creator: { _id: authContext.userId },
          },
        ]);
      })
      .catch((err) => {
        console.error("Error creating game:", err);
      });
  };

  // Cancel creating a game or selecting a game
  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedGame(null);
  };

  // Fetch the list of games from the server
  const fetchGames = () => {
    setIsLoading(true);

    const requestBody = {
      query: `
        query {
          games {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed to fetch games!");
        }
        return res.json();
      })
      .then((resData) => {
        const fetchedGames = resData.data.games;
        console.log("Fetched Games:", fetchedGames);
        if (isActive) {
          setGames(fetchedGames);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        if (isActive) {
          setIsLoading(false);
        }
      });
  };

  // Show game details when a game is selected
  const showDetailHandler = (gameId) => {
    const selected = games.find((g) => g._id === gameId);
    setSelectedGame(selected);
  };

  // Book a game when the user is authenticated
  const bookGameHandler = () => {
    if (!authContext.token) {
      setSelectedGame(null);
      return;
    }

    const requestBody = {
      query: `
        mutation BookGame($id: ID!) {
          bookGame(gameId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: selectedGame._id,
      },
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authContext.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed to book game!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log("Game booked successfully:", resData);
        setSelectedGame(null);
      })
      .catch((err) => {
        console.error("Error booking game:", err);
      });
  };

  return (
    <React.Fragment>
      {(creating || selectedGame) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Game"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedGame && (
        <Modal
          title={selectedGame.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookGameHandler}
          confirmText={authContext.token ? "Book" : "Confirm"}
        >
          <h1>{selectedGame.title}</h1>
          <h2>
            ${selectedGame.price} -{" "}
            {new Date(selectedGame.date).toLocaleDateString()}
          </h2>
          <p>{selectedGame.description}</p>
        </Modal>
      )}
      {authContext.token && (
        <div className="games-control">
          <p>Share your own Games!</p>
          <button className="btn" onClick={startCreateGameHandler}>
            Create Game
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <GameList
          games={games}
          authUserId={authContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default GamesPage;

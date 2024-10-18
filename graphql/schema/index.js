const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Booking{
      _id: ID!
      game: Game!
      user: User!
      createdAt: String!
      updatedAt: String!
    }

    type Game{
        _id: ID!
        title: String!
        description: String!
        price:  Float!
        date: String!
        creator: User!
    }

    type User{
      _id: ID!
      email:String!
      password: String
      createdGames: [Game!]
    }

    type AuthData{
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }

    input GameInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput{
      email: String!
      password: String!
    }

    type RootQuery{
        games: [Game!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation{
        createGame(gameInput: GameInput): Game 
        createUser(userInput: UserInput): User
        bookGame(gameId: ID!): Booking!
        cancelBooking(bookingId: ID!): Game!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }    
`);

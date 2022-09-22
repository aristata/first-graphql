import { ApolloServer, gql } from "apollo-server";

/**
 * 1. 우리 data 의 shape 를 graphql 한테 설명해줘야 한다
 * 2. 반드시 Query 타입이 하나 있어야만 한다
 * 3. 하위 타입들은 내가 정의해서 쓰면된다
 * 4. argument 를 사용하여 조건을 구체화 할 수 있다
 */
const typeDefs = gql`
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  type User {
    id: ID!
    username: String!
    firstname: String
    lastname: String
  }

  # Get
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }

  # Post, Put, Patch, Delete
  type Mutation {
    postTweet(text: String, userId: ID): Tweet!
    updateTweet(id: ID, text: String): Tweet
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    // argument 는 두번째 위치에 넣어준다
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    ping() {
      return "pong";
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

// fake db
const tweets = [
  {
    id: "1",
    text: "hello",
    author: {
      id: "1",
      username: "ace"
    }
  },
  {
    id: "2",
    text: "world",
    author: {
      id: "2",
      username: "base"
    }
  },
  {
    id: "3",
    text: "graphql",
    author: {
      id: "1",
      username: "ace"
    }
  },
  {
    id: "4",
    text: "first",
    author: {
      id: "3",
      username: "cane"
    }
  },
  {
    id: "5",
    text: "sample",
    author: {
      id: "2",
      username: "base"
    }
  }
];

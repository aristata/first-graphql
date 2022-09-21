import { ApolloServer, gql } from "apollo-server";
/**
 * 1. 우리 data 의 shape 를 graphql 한테 설명해줘야 한다
 * 2. 반드시 Query 타입이 하나 있어야만 한다
 * 3. 하위 타입들은 내가 정의해서 쓰면된다
 * 4. argument 를 사용하여 조건을 구체화 할 수 있다
 */
const typeDefs = gql`
  # Get
  type Query {
    allTweets: [Tweet]
    Tweet(id: ID): Tweet
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }

  type User {
    id: ID
    username: String
  }

  # Post, Put, Patch, Delete
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    updateTweet(id: ID, text: String): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

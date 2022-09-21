import { ApolloServer, gql } from "apollo-server";

// 우리 data 의 shape 를 graphql 한테 설명해줘야 한다
// 반드시 Query 타입이 하나 이상 있어야만 한다
const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

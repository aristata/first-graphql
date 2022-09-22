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
    author: User
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
  },
  Mutation: {
    postTweet(_, { text }) {
      // 새 tweet 객체를 생성한다
      const newTweet = {
        id: tweets.length + 1,
        text: text
      };

      // tweets 배열에 새 tweet 객체를 추가한다
      tweets.push(newTweet);

      // 새 tweet 객체를 반환한다
      return newTweet;
    },
    deleteTweet(_, { id }) {
      // 먼저 id 로 tweet 를 찾는다
      const foundTweet = tweets.find((tweet) => tweet.id === id);

      // tweet 를 찾지 못했으면 함수를 종료한다
      if (!foundTweet) return false;

      // tweet 를 찾았으면 tweets 에서 tweet 를 제거한다
      // 구현할 로직은 tweets 의 tweet 들 중에서 id 가 다른 것들만 찾아 새로운 배열을 tweets 에 저장한다
      tweets = tweets.filter((tweet) => tweet.id !== foundTweet.id);

      // deleteTweet 함수는 결과로 boolean 값을 반환한다
      // 코드가 여기까지 진행되었다면 데이터가 삭제된 것과 같은 효과가 있기 때문에 true 를 반환한다
      return true;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

// fake db
let tweets = [
  {
    id: "1",
    text: "hello"
  },
  {
    id: "2",
    text: "world"
  }
];

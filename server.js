import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

/**
 * 1. 우리 data 의 shape 를 graphql 한테 설명해줘야 한다
 * 2. 반드시 Query 타입이 하나 있어야만 한다
 * 3. 하위 타입들은 내가 정의해서 쓰면된다
 * 4. argument 를 사용하여 조건을 구체화 할 수 있다
 */
const typeDefs = gql`
  """
  트위트
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  """
  사용자
  """
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }

  # Get
  type Query {
    """
    모든 트위트를 조회한다
    """
    allTweets: [Tweet!]!
    """
    아이디를 입력받아 트위트를 조회한다
    """
    tweet(id: ID!): Tweet!
    """
    핑퐁 테스트
    """
    ping: String!
    """
    모든 유저를 조회한다
    """
    allUsers: [User!]!
    allMovies: [Movie!]!
    movie(id: String!): Movie
  }

  # Post, Put, Patch, Delete
  type Mutation {
    """
    트위트를 등록한다
    """
    postTweet(text: String, userId: ID): Tweet
    """
    트위트를 업데이트 한다
    """
    updateTweet(id: ID, text: String): Tweet
    """
    트위트를 삭제한다
    """
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
    },
    allUsers() {
      return users;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    }
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      // 입력받은 userId 가 유효한지 확인하기 위해 유저조회를 먼저 실행한다
      const foundUser = users.find((user) => user.id === userId);

      // 만약 발견된 유저가 없으면 포스트 트윗 함수를 종료한다
      if (!foundUser) return null;

      // 새 tweet 객체를 생성한다
      const newTweet = {
        id: tweets.length + 1,
        text: text,
        userId: userId
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
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    }
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
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
    text: "hello",
    userId: "1"
  },
  {
    id: "2",
    text: "world",
    userId: "2"
  }
];

let users = [
  {
    id: "1",
    firstName: "Seongmin",
    lastName: "Jang"
  },
  {
    id: "2",
    firstName: "Aristata",
    lastName: "Jang"
  }
];

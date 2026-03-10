import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    lnik: new HttpLink({
    uri: 'http://localhost:3001/graphql',
    }),
    cache: new InMemoryCache(),
})

export default client;
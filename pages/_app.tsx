import React from 'react';
import BaseApp, { Container } from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import withApollo, { WithApolloProps } from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import introspection from '~/introspection.json';
import { theme } from '~/theme';
import { OperationDefinitionNode } from 'graphql';

export type RedirectFn = (target: string, code?: number) => void;

export interface AppProps extends WithApolloProps<any> {
  apollo: ApolloClient<any>;
}

class App extends BaseApp<AppProps> {
  public render() {
    const Component = this.props.Component;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={this.props.apollo}>
            <CssBaseline />
            <Component {...this.props.pageProps} />
          </ApolloProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

const createErrorLink = () =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        // tslint:disable-next-line:no-console
        console.log('[GQL ERROR]: Message: %s, Path: %s, Locations: %o', message, path && path.join('.'), locations);
      });
    }

    if (networkError) {
      // tslint:disable-next-line:no-console
      console.log('[GQL NETWORK ERROR]: %s', networkError.message);
    }

    return forward(operation);
  });

const createDataLink = () => {
  const httpLink = new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/iherger/melon-ash-kovan',
  });

  if (!process.browser) {
    return httpLink;
  }

  const wsLink = new WebSocketLink({
    uri: 'wss://api.thegraph.com/subgraphs/name/iherger/melon-ash-kovan',
    options: {
      reconnect: true,
    },
  });

  return ApolloLink.split(
    op => {
      const { kind, operation } = getMainDefinition(op.query) as OperationDefinitionNode;
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );
};

const createClient = () => {
  const cache = new InMemoryCache({
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: introspection,
    }),
  });

  const errorLink = createErrorLink();
  const dataLink = createDataLink();
  const mergedLink = ApolloLink.from([errorLink, dataLink]);

  const client = new ApolloClient({
    link: mergedLink,
    cache,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return client;
};

export default withApollo(createClient)(App);

import React from 'react';
import NoSsr from 'react-no-ssr';
import BaseApp from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import withApollo, { WithApolloProps } from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '~/theme';

export type RedirectFn = (target: string, code?: number) => void;

export interface AppProps extends WithApolloProps<any> {
  apollo: ApolloClient<any>;
}

class App extends BaseApp<AppProps> {
  public render() {
    const Component = this.props.Component;

    return (
      <NoSsr>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={this.props.apollo}>
            <CssBaseline />
            <Component {...this.props.pageProps} />
          </ApolloProvider>
        </ThemeProvider>
      </NoSsr>
    );
  }
}

const createErrorLink = () =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        // tslint:disable-next-line:no-console
        console.log('[GQL ERROR]: Message: %s, Path: %s, Locations: %o', message, path?.join('.'), locations);
      });
    }

    if (networkError) {
      // tslint:disable-next-line:no-console
      console.log('[GQL NETWORK ERROR]: %s', networkError.message);
    }

    return forward(operation);
  });

const createDataLink = () => {
  const httpUri = process.env.MELON_SUBGRAPH;
  const httpLink = new HttpLink({
    uri: httpUri,
  });

  return httpLink;
};

const createClient = () => {
  const cache = new InMemoryCache();
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

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AuthenticatedApp from './Router/AuthenticatedApp';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import * as serviceWorker from './serviceWorker';
const Routes = AuthenticatedApp;

const middlewareLink = new ApolloLink((operation, forward) => {
	operation.setContext({
		headers: {
			'x-token': localStorage.getItem('token'),
			'x-refresh-token': localStorage.getItem('refreshToken')
		}
	});
	return forward(operation);
});

const afterwareLink = new ApolloLink((operation, forward) => {
	return forward(operation).map(response => {
		const context = operation.getContext();
		const {
			response: { headers }
		} = context;

		if (headers) {
			const token = headers.get('x-token');
			const refreshToken = headers.get('x-refresh-token');

			if (token) {
				localStorage.setItem('token', token);
			}

			if (refreshToken) {
				localStorage.setItem('refreshToken', refreshToken);
			}
		}
		return response;
	});
});

const httpLink = new HttpLink({
	uri: 'http://localhost:3009/graphql'
});

const wsLink = new WebSocketLink({
	uri: `ws://localhost:3009/graphql`,
	options: {
		reconnect: true
	}
});
const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));

const link = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	httpLinkWithMiddleware
);

const cache = new InMemoryCache();

const client = new ApolloClient({
	link,
	cache
});

const App = () => (
	<ApolloProvider client={client}>
		<Routes />
	</ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import decode from 'jwt-decode';
import Login from '../Containers/Login';
import Routes from './index';

const isAuthenticated = () => {
	const token: string | null = localStorage.getItem('token');
	const refreshToken: string | null = localStorage.getItem('refreshToken');
	try {
		decode(token!);
		decode(refreshToken!);
	} catch (err) {
		return false;
	}
	return true;
};

interface PrivateRouteProps extends Omit<RouteProps, 'component'> {
	component: React.ElementType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props =>
				isAuthenticated() ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login'
						}}
					/>
				)
			}
		/>
	);
};

const AuthApp = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/login" component={Login} />
				<PrivateRoute path="" component={Routes} />
			</Switch>
		</Router>
	);
};

export default AuthApp;

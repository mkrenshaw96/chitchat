import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import Messages from '../Containers/Messages';

const Routes = ({ match }: RouteComponentProps) => (
	<Switch>
		<Route path={match.path} exact>
			<div>ROUTES</div>
		</Route>
		<Route path="/message" exact component={Messages} />
	</Switch>
);

export default Routes;

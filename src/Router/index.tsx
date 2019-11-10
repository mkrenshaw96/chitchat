import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import Test from '../Containers/Test';
import Test2 from '../Containers/Test/test';

const Routes = ({ match }: RouteComponentProps) => (
	<Switch>
		<Route path={match.path} exact>
			<div>ROUTES</div>
		</Route>
		<Route path="/test" exact component={Test} />
		<Route path="/test2" exact component={Test2} />
	</Switch>
);

export default Routes;

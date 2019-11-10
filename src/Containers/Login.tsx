import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import Login from '../Components/Login';

const LoginContainer = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	function onInputChanged(event: any): void {
		const key = event.currentTarget.name;
		const value = event.target.value;
		switch (key) {
			case 'username':
				return setUsername(value);
			case 'password':
				return setPassword(value);
			default:
				break;
		}
	}

	const [handleLogin, { data, loading, error }] = useMutation(HANDLE_LOGIN, {
		variables: {
			username,
			password
		}
	});
	if (data) {
		const { ok, token, refreshToken, errors } = data.loginUser;
		if (ok) {
			localStorage.setItem('token', token);
			localStorage.setItem('refreshToken', refreshToken);
			return <Redirect to="/" />;
		} else {
			errors.map((x: any) => console.log('MSG >>>', x.message, 'PATH >>>', x.path));
			return <div>ERROR</div>;
		}
	}
	return (
		<Login
			username={username}
			password={password}
			onInputChanged={onInputChanged}
			onSubmit={async () => {
				await handleLogin();
			}}
			data={!loading && !error && data ? data : null}
		/>
	);
};

const HANDLE_LOGIN = gql`
	mutation($username: String!, $password: String!) {
		loginUser(username: $username, password: $password) {
			ok
			token
			refreshToken
			errors {
				path
				message
			}
		}
	}
`;

export default LoginContainer;

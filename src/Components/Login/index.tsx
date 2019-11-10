import React from 'react';

interface Props {
	onInputChanged(event: React.FormEvent<HTMLInputElement>): void;
	onSubmit: () => Promise<void>;
	data?: {
		ok: boolean;
		errors: Array<string>;
		token: string;
		refreshToken: string;
	};
	username?: string;
	password?: string;
}
const Login = ({ onInputChanged, onSubmit, data, username, password }: Props) => (
	<div>
		<form
			onSubmit={e => {
				e.preventDefault();
				onSubmit();
			}}
		>
			<input
				type="text"
				onChange={e => onInputChanged(e)}
				placeholder="username"
				name="username"
				value={username}
			/>
			<input
				type="text"
				onChange={e => onInputChanged(e)}
				placeholder="password"
				name="password"
				value={password}
			/>
			<button type="submit">SUBMIT</button>
		</form>
	</div>
);

export default Login;

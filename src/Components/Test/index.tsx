import React from 'react';

interface Props {
	messages: Array<{ text: string; userId: string }>;
}

const Test = ({ messages }: Props) => {
	return (
		<div>
			{messages.map((msg, i) => (
				<div key={i}>
					<strong>TEXT:</strong> {msg.text} <strong>USER ID:</strong> {msg.userId}
				</div>
			))}
		</div>
	);
};
export default Test;

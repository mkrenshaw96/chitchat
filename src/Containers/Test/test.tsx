import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

const NEW_MESSAGE_SUBSCRIPTION = gql`
	subscription($convoId: String!) {
		newMessage(convoId: $convoId) {
			ok
			message {
				text
				userId
			}
		}
	}
`;

const GET_MESSAGES_FROM_CONVO = gql`
	query($convoId: ID!) {
		getMessagesFromConvo(convoId: $convoId) {
			ok
			messages {
				text
				userId
			}
		}
	}
`;

const TESTING_CONVO_ID = '1a7b4899-959b-495b-97a4-b2203de8d02b';

const Test = () => {
	const { subscribeToMore, ...result } = useQuery(GET_MESSAGES_FROM_CONVO, {
		variables: {
			convoId: TESTING_CONVO_ID
		}
	});
	return (
		<Thing
			{...result}
			subscribeToNewComments={() =>
				subscribeToMore({
					document: NEW_MESSAGE_SUBSCRIPTION,
					variables: {
						convoId: TESTING_CONVO_ID
					},
					updateQuery: ({ getMessagesFromConvo }, { subscriptionData: { data } }) => {
						const {
							newMessage: { message }
						} = data;
						if (!data) return getMessagesFromConvo;
						console.log('this ran');
						return Object.assign({}, getMessagesFromConvo, {
							getMessagesFromConvo: {
								__typename: getMessagesFromConvo.__typename,
								ok: getMessagesFromConvo.ok,
								messages: [...getMessagesFromConvo.messages, message]
							}
						});
					}
				})
			}
		/>
	);
};

const Thing = ({ subscribeToNewComments, data }: any) => {
	useEffect(() => {
		subscribeToNewComments();
		// eslint-disable-next-line
	}, []);
	return (
		<div>
			{data
				? data.getMessagesFromConvo.messages.map((x: any, key: any) => {
						return <div key={key}>{x.text}</div>;
				  })
				: null}
		</div>
	);
};

export default Test;

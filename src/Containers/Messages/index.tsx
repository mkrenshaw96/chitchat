import React, { useState } from 'react';
import Messages from '../../Components/Messages';
import { useQuery, useMutation } from 'react-apollo';
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

const CREATE_MESSAGE = gql`
	mutation($text: String!, $convoId: ID!) {
		createMessage(convoId: $convoId, text: $text) {
			ok
			message {
				text
				convoId
				userId
			}
		}
	}
`;

const TESTING_CONVO_ID = '1a7b4899-959b-495b-97a4-b2203de8d02b';

const MessagesContainer = () => {
	const [text, setText] = useState('');
	const [create] = useMutation(CREATE_MESSAGE, { variables: { text, convoId: TESTING_CONVO_ID } });
	const { subscribeToMore, ...result } = useQuery(GET_MESSAGES_FROM_CONVO, {
		variables: {
			convoId: TESTING_CONVO_ID
		}
	});
	function handleCreateMessageMutation(sub: () => () => void) {
		create();
		sub();
	}
	return (
		<Messages
			text={text}
			setText={setText}
			handleCreateMessageMutation={handleCreateMessageMutation}
			{...result}
			subscribeToNewMessage={() =>
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

export default MessagesContainer;

import React from 'react';
import Test from '../../Components/Test';
import { useQuery } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import gql from 'graphql-tag';

const TestContainer = (props: RouteComponentProps) => {
	const convoId = '1a7b4899-959b-495b-97a4-b2203de8d02b';
	const { loading, error, data } = useQuery(GET_MESSAGES_FROM_CONVO, {
		variables: {
			convoId
		}
	});
	if (!loading && !error) {
		return <Test messages={data.getMessagesFromConvo.messages} />;
	} else {
		return <div>loading...</div>;
	}
};

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

export default TestContainer;

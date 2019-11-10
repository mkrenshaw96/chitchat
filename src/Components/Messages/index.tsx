import React from 'react';
import './index.css';
import decode from 'jwt-decode';
import EmojiToggle from './Assets/emoji.svg';
import Send from './Assets/send.svg';

// this needs to be moved out to global state when testing is complete.
const who = () => {
	const token: string | null = localStorage.getItem('token');
	const { id } = decode(token!);
	return id;
};

const isMe = { background: '#298cf1', color: 'white', alignSelf: 'flex-end' };
const notMe = { background: '#e9e8ed', color: 'grey', alignSelf: 'flex-start' };

interface Props {
	subscribeToNewMessage: () => () => void;
	data: any;
	handleCreateMessageMutation: (subscribeToNewMessage: () => () => void) => void;
	text: string;
	setText: React.Dispatch<React.SetStateAction<string>>;
}

const Messages = ({ subscribeToNewMessage, data, handleCreateMessageMutation, text, setText }: Props) => {
	return (
		<div id="chat-wrapper">
			<div id="chat-convo">
				<div className="chat-comp-container">
					<div id="chat-convo-current-name">Test Conversation</div>
				</div>
				<div id="chat-convo-messages">
					{data ? (
						data.getMessagesFromConvo.messages.map(
							(message: { userId: string; text: string }, index: number) => {
								return (
									<div
										key={index}
										className="chat-convo-bubble"
										style={who() === message.userId ? isMe : notMe}
									>
										{message.text}
									</div>
								);
							}
						)
					) : (
						<div>{`No Messages :(`}</div>
					)}
				</div>
				<div id="chat-convo-interactions">
					<img src={EmojiToggle} alt="emoji-toggle" className="chat-convo-btns" />
					<input
						type="text"
						placeholder="Type a message..."
						id="chat-convo-input"
						onChange={e => setText(e.target.value)}
					/>
					<input
						type="image"
						src={Send}
						alt="send-message"
						className="chat-convo-btns"
						onClick={e => (text.length > 0 ? handleCreateMessageMutation(subscribeToNewMessage) : null)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Messages;

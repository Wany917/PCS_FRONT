import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './chatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

const MyChatbot: React.FC = () => {
  return <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />;
};

export default MyChatbot;

import React, { useState, useRef, useEffect } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message as UIMessage,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import styles from "./AskAI.module.css";


import { OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai-api";

const CHATGPT_USER = "ChatGPT";
const DEFAULT_BEHAVIOR = "General Conversation";

function AskAI({ apiKey }) {
  const messageInput = useRef(null);

  const [messages, setMessages] = useState([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [behaviorInput, setBehaviorInput] = useState(DEFAULT_BEHAVIOR);
  const [behavior, setBehavior] = useState(DEFAULT_BEHAVIOR);

  useEffect(() => {
    if (!waitingForResponse) {
      messageInput.current?.focus();
    }
  }, [waitingForResponse]);

  const sendMessage = async (messageText) => {
    const newMessage = {
      content: messageText,
      sentTime: Math.floor(Date.now() / 1000),
      sender: "You",
      direction: "outgoing"
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    setWaitingForResponse(true);
    const response = await getResponse([...messages, newMessage], apiKey); // Pass updated messages including new message and API key
    const newMessageResponse = {
      content: response.content,
      sentTime: Math.floor(Date.now() / 1000),
      sender: CHATGPT_USER,
      direction: "incoming"
    };

    setMessages(prevMessages => [...prevMessages, newMessageResponse]);
    setWaitingForResponse(false);
  };

  const getResponse = async (prevMessages, apiKey) => 
  {
    const systemMessage = {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: behavior,
    };

    const input = prevMessages.map((message) => {
      return {
        role: message.sender === CHATGPT_USER ? ChatCompletionRequestMessageRoleEnum.Assistant : ChatCompletionRequestMessageRoleEnum.User,
        content: message.content,
      };
    });

    // Create an OpenAIApi instance
    const OPENAI_CLIENT = new OpenAIApi({
      apiKey: apiKey,
    });

    const response = await OPENAI_CLIENT.createChatCompletion({
      model: 'gpt-3.5-turbo-0125',
      messages: [systemMessage, ...input],
    });

    return {
      content: response.data.choices[0].message?.content,
    };
  };

  const updateBehavior = () => {
    const finalBehavior = behaviorInput.trim().length ? behaviorInput.trim() : DEFAULT_BEHAVIOR;
    setBehavior(finalBehavior);
  };

  return (
    <div className={styles.container}>
      <h2>Chat with Us!!</h2>
      <div className={styles.inputContainer}>
        <input className={styles.input} value={behaviorInput} onChange={e => setBehaviorInput(e.target.value)} />
        <button className={styles.submit} onClick={updateBehavior}>Update Behavior</button>
      </div>
      <div className={styles.chatWrapper}>
        <div className={styles.chatContainer}>
          <MainContainer>
            <ChatContainer>
              <MessageList className={styles.chatMessageList}typingIndicator={waitingForResponse && <TypingIndicator content="ChatGPT is thinking" style={{ background: '#432A74' }} />}
              >
                {messages.map((message, index) => (
                  <UIMessage
                    key={index}
                    model={{
                      message: message.content,
                      sentTime: `${message.sentTime}`,
                      sender: message.sender,
                      direction: message.direction,
                      position: "normal",
                      type: "text"
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type Message here"
                style={{ background: '#432A74' }}
                onSend={sendMessage}
                autoFocus={true}
                attachButton={false}
                disabled={waitingForResponse}
                ref={messageInput}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}
export default AskAI;
import styles from "./AI.module.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import gpt1 from "../assets/gpt1.jpg";
import Logo from "../assets/Logo.png";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";

const API_KEY = "";

function AI() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am from BookMyEvents Team!",
      sender: "ChatGPT",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage]; //old msg + new msg

    //update our messages state
    setMessages(newMessages);

    setTyping(true);

    await proceessMessageToChatGPT(newMessages);
  };

  async function proceessMessageToChatGPT(chatMessages) {
    //chatMessages {sender: "user" or "ChatGPT"}, message: "The Message content here"}
    //apiMessages {role: "user" or "assistant", content:"The Message content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    //role : "user" ->a msg from the user , "assistant" ->a response from ChatGPT
    //"system" -> generally one initial message defining HOW we want chatgpt to talk

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages, //[msg1,msg2]
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      //await to complete statement first,then execute further
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }
  return (
    <>
      <h2
        style={{
          marginTop: "-95px",
          backgroundColor: "lightyellow",
          marginLeft: "4px",
        }}
      >
        <div className={styles.helpcenter}>
          <img src={Logo} className={styles.helpcenterlogo}alt="" width={"280px"} height={"auto"} />
          <h1><strong>BookMyEvents Support Centre :-) </strong></h1>
        </div>
        <hr style={{
          marginTop:"-35px",
          color:"red",
          borderWidth:"5px"

        }}/> 
        <center style={{
          marginLeft:"-550px",
          color:"blue"
        }}>How can we help you today ?</center>
      </h2>
      <div
        className={styles.container}
        style={{
          backgroundImage: { gpt1 },
          marginTop: "-20px",
          boxShadow:
            " rgba(240, 46, 170, 0.4) 0px 5px, rgba(240, 46, 170, 0.3) 0px 10px, rgba(240, 46, 170, 0.2) 0px 15px, rgba(240, 46, 170, 0.1) 0px 20px, rgba(240, 46, 170, 0.05) 0px 25px",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "800px",
            width: "700px",
          }}
        >
          <div className={styles.chatWrapper}>
            <center>
              <div
                className={styles.ChatContainer}
                style={{
                  marginTop: "-25px",
                  boxShadow:
                    "blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px, rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px, rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px, rgb(255, 85, 85) 40px -40px",
                  textAlign: "left",
                }}
              >
                <MainContainer>
                  <ChatContainer>
                    <MessageList
                      className={styles.chatMessageList}
                      scrollBehavior="smooth"
                      typingIndicator={
                        typing ? (
                          <TypingIndicator content="ChatGPT is typing" />
                        ) : null
                      }
                    >
                      {messages.map((message, i) => {
                        const messageClasses = [styles.messageContainer];
                        if (message.sender === "ChatGPT") {
                          messageClasses.push(styles.left); // Add left class for ChatGPT messages
                        } else {
                          messageClasses.push(styles.right); // Add right class for user messages
                        }

                        return (
                          <div className={messageClasses.join(" ")} key={i}>
                            <div className={styles.messageBubble}>
                              {message.message}
                            </div>
                            {message.sender !== "ChatGPT" && (
                              <div className={styles.messageSender}>
                                {message.sender}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </MessageList>

                    <MessageInput
                      placeholder="Type message here"
                      onSend={handleSend}
                    />
                  </ChatContainer>
                </MainContainer>
              </div>
            </center>
          </div>
        </div>
      </div>
    </>
  );
}
export default AI;

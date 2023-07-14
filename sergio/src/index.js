import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // variable
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // send POST request to server, get response then set as paragraph text
    fetch("http://localhost:3000/runPython", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        message: userMessage,
    })
})
.then(res => res.text())  // Use res.text() to read the response body as text
.then(data => {
    console.log(data);  // Log the actual data received
    messageElement.textContent = data.trim();
})
.catch(() => {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
})
.finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

}


const handleChat = () => {
    userMessage = chatInput.value.trim(); // get message from user
    if(!userMessage) return;

    // clear input text stylistic can change later
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // put user message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // chatbot buffer -> thinking...
        const incomingChatLi = createChatLi("sergio's cooking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // height of the inputs
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // can go to another line with shift + enter (thinking of chat gpt -> can remove later idk) 
    // width is greater than 800px, handle the chat = responsive
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
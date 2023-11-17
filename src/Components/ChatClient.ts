/**
 * ChatClient
 * 
 * @export
 * 
 */

import { MessagesContainer, MessageContainer } from "../Server/Globals";



class ChatClient {

    earliestMessageID: number = 10000000000;
    previousMessagesFetched: boolean = false;

    messages: MessageContainer[] = [];

    updateDisplay: () => void = () => { };
    /**
     * Creates an instance of ChatClient.
     * @memberof ChatClient
     */
    constructor() {
        console.log("ChatClient");
        this.getMessages();
        this.getMessagesContinuously();
    }

    setCallback(callback: () => void) {
        this.updateDisplay = callback;
    }


    insertMessage(message: MessageContainer) {
        const messageID = message.id;

        if (this.earliestMessageID > messageID) {
            this.earliestMessageID = messageID;

        }

        if (this.messages.length === 0) {
            this.messages.push(message);
            console.log(`inserted message ${messageID} into empty array`)
            return;
        }

        if (messageID > this.messages[0].id) {
            this.messages.unshift(message);
            console.log(`inserted message ${messageID} at the beginning of the array`)

            return;
        }

        if (messageID < this.messages[this.messages.length - 1].id) {
            this.messages.push(message);
            console.log(`inserted message ${messageID} at the end of the array`)
            this.previousMessagesFetched = true;

            return;
        }
        // console.log(`Message is not inserted ${messageID}`)
    }

    insertMessages(messages: MessageContainer[]) {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            this.insertMessage(message);

        }
        this.updateDisplay();
    }

    /** 
     * get the last 10 messages from the server if the paging token is empty
     * get the next 10 messages from the server if the paging token is not empty
     */
    getMessages(pagingToken: string = '') {

        // const url = `http://localhost:3005/messages/get/`;
        const url = `https://spreadsheet-server.onrender.com/messages/get`

        const fetchURL = `${url}${pagingToken}`;
        fetch(fetchURL)
            .then(response => response.json())
            .then((messagesContainer: MessagesContainer) => {
                let messages = messagesContainer.messages;
                this.insertMessages(messages);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * get the messages once a second
     */
    getMessagesContinuously() {
        console.log("getMessagesContinuously()");
        setInterval(() => {
            this.getMessages();
        }, 200);

    }

    getNextMessages() {
        console.log("getNextMessages()");
        console.log(`this.earliestMessageID: ${this.earliestMessageID - 1}`);
        const nextMessageToFetch = this.earliestMessageID - 1;
        const pagingToken = `__${nextMessageToFetch.toString().padStart(10, '0')}__`;
        this.getMessages(pagingToken);
    }

    sendMessage(message: string, user: string) {
        if (user === "") {
            alert("Please enter a user name");
            return;
          }

          if (message === "") {
            alert("Please enter a message");
            return;
          }

        console.log("sentMessage()");
        // const url = `http://localhost:3005/message/${user}/${message}`;
        const url = `https://spreadsheet-server.onrender.com/message/${user}/${message}`

        fetch(url)
            .then(response => response.json())
            .then((messagesContainer: MessagesContainer) => {
                let messages = messagesContainer.messages;
                this.insertMessages(messages);
            })
            .catch((error) => {
                console.error(error);
            });
    }





}

export default ChatClient;
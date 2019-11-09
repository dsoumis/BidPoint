import React, {useEffect, useState} from 'react';
import './Messages.css';
import InboxMessage from './InboxMessage.js';
import OutboxMessage from './OutboxMessage.js';

function Messages(){
    const [loaded,setLoaded] = useState(false);
    const [messages, setMessage] = useState({
        userName: '',
        Unread: 0,
        Sent: [],
        Inbox:[]
    });

    useEffect(function () {
        getMessagesInDb();

    },[]);


    async function getMessagesInDb() {

        const response = await fetch(`https://localhost:3001/getMyMessages`, {
                method: 'Get',
                mode: "cors",
                // cache: "default",
                credentials: "include",
                // headers: {
                //     'Content-Type': 'application/json'
                // }`
            }
        );
        const data = await response.json();
        console.log(data);
        //console.log(`o server mas epestrepse   ${data.Inbox[0].Message}`);
        setMessage({
            userName: data.userName,
            Unread: data.Unread,
            Sent: data.Sent,
            Inbox: data.Inbox
        });
        console.log('to sent'+data.Sent);
        setMessage(data);
        setLoaded(true);

    }

    const htmlReady =(


        <div className="mess" >
            <div className="mess-details">
                <h2>{messages.userName}'s messages</h2>
                <h4>unread: {messages.Unread}</h4>
            </div>

            <div className="inbox">
                <h2> Inbox messages</h2>
                {messages.Inbox.map((mes,idx) =>(
                    <div key={idx} className="message-display">
                        <InboxMessage
                            key = {mes._id}
                            id = {mes._id}
                            From = {mes.From}
                            Read = {mes.Read}
                            Message = {mes.Message}
                        />

                    </div>

                ))}
            </div>

            <div className="sent">
                <h2> Sent messages</h2>
                { messages.Sent.map((mes,idx) =>(
                    <div key={idx} className="message-display">
                        <OutboxMessage
                            key = {mes._id}
                            id = {mes._id}
                            To = {mes.To}
                            Message = {mes.Message}
                        />

                    </div>

                ))}
            </div>
        </div>
    );

    return(


        <div>
            {loaded ? htmlReady : (<h1>No messages</h1>)}
        </div>
    )
}

export default Messages;
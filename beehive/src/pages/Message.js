import React, { useRef, useState, useEffect } from 'react';
import Footerbar from '../components/Footerbar';
import Navbar from '../components/Navbar';
import * as BIcons from "react-icons/bs";
import * as FIcons from "react-icons/fa6";
import './Message.css';
import { uniqBy } from 'lodash';


function Message() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [user, setUser] = useState(null);

    const [ws, setWs] = useState(null);

    useEffect(() => {
        connectToWs();
    }, []);    

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:3001/');
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect.');
                connectToWs();
            }, 1000);
        });
        setWs(ws);
    }

    useEffect(() => {
      if (ws && user) {
        ws.onmessage = handleMessage;
      }
    }, [ws, user]);

    function handleMessage(ev){
        const messageData = JSON.parse(ev.data);
        console.log({ev, messageData});
        if (messageData.type === 'onlineUsers') {
            const uniqueUsers = messageData.users.filter((userItem) =>
              user && userItem.userId !== user.userId
            );
            const userIdToUsername = uniqueUsers.reduce((obj, userItem) => {
              obj[userItem.userId] = userItem.username;
              return obj;
            }, {});
            setOnlineUsers(userIdToUsername);
        } else if (messageData.type === 'chatMessage') {
            console.log({messageData});
            // Here you can add the message to your list of messages
            setMessages(oldMessages => ([...oldMessages, {...messageData}]));
        } else if (messageData.type === 'userInfo') {
            setUser(messageData.user);
        }
    };

    const messagesWithoutDupes = uniqBy(messages, '_id');
    
    const lastMessageRef = useRef(null);

    useEffect(() => {
        if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messagesWithoutDupes]);
    
    function sendMessage(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            type: 'chatMessage',
            recipient: selectedUserId,
            text: newMessage,
          }));
          setNewMessage('');
          setMessages(oldMessages => ([...oldMessages, {
            text: newMessage, 
            sender: user.userId, 
            recipient: selectedUserId,
            _id: Date.now(),
        }]));
    }

    useEffect(() => {
        if (selectedUserId) {
          fetch('http://localhost:3001/messages/' + selectedUserId, { credentials: 'include'})
            .then((response) =>{
               return response.json()
                
            })
            .then(data => {
              setMessages(data); // directly use data here
            })
            .catch(error => {
                console.log("Error in getting request:", error )
              // handle the error
            });
        }
    }, [selectedUserId]);
  
    return (
        <>
            <Navbar />

  <div className="container">
      <section className="discussions">
        <div className="discussion search">
          <div className="searchbar">
            <input type="text" placeholder="Search..."></input>
          </div>
        </div>
 {Object.entries(onlineUsers).map(([userId, username]) => (
    <div key={userId}>
      <div className={(userId === selectedUserId ? 'message-active' : '')} >
        <div onClick={() => setSelectedUserId(userId)} 
        className="discussion">
          <div className="photo" >
          </div>
          <div className="desc-contact">
            <p className="name "> {username}</p>
            <p className="message"></p>
          </div>
        </div>
        </div>
        </div>
        ))}
      </section>


      <section className="chat bg-blue-100">
    <div className="flex-grow">

      {!!selectedUserId && (
  <div className='overflow-y-scroll'>
    {messagesWithoutDupes.map((message, index, array) => (
      <div key = {message._id} className={(message.sender === user.userId ? 'sent': 'received')} ref={index === array.length - 1 ? lastMessageRef : null}>
        <div className={"message-box " +(message.sender === user.userId ? 'bg-blue-500 text-white': 'bg-white text-gray-500')}>
          <div>{message.text}</div>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
    </section>
    {!selectedUserId && (
        <form className="footer-chat1" onSubmit={sendMessage}>
        <input type="text" 
        value={newMessage}
        onChange={ev => setNewMessage(ev.target.value)}
        className="write-message" placeholder="Type your message here"></input>
        <button type='submit' className="ms">
        <FIcons.FaRegPaperPlane/>
  </button>
      </form>
      )}
        {!!selectedUserId && (
            <form className="footer-chat" onSubmit={sendMessage}>
            <input type="text" 
            value={newMessage}
            onChange={ev => setNewMessage(ev.target.value)}
            className="write-message" placeholder="Type your message here"></input>
            <button type='submit' className="ms">
            <FIcons.FaRegPaperPlane/>
      </button>
          </form>
        )}
  
  </div>
        </>
    );
}

export default Message;

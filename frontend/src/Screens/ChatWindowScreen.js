import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { IoSendSharp } from 'react-icons/io5';
import { RxFontStyle } from 'react-icons/rx';
import MyStatefulEditor from '../Components/rte_test';
import { Store } from '../Store';
import { Socket, io } from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'timeago.js';

function ChatWindowScreen() {
  const { id } = useParams();
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/message/${id}`);
        setChatMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [conversation]);

  const showFontStyleBox = () => {
    setShowFontStyle(!showFontStyle);
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
    if (val.trim() !== '') {
      setMessages([...messages, val]);
      setVal('');
    }
    submitHandler();
  };
  const [val, setVal] = useState('');
  const onChange = (value) => {
    setVal(value);
  };

  const submitHandler = async (e) => {
    try {
      const { data } = await axios.post('/api/message/', {
        conversationId: id,
        sender: userInfo._id,
        text: newMessage,
      });
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-center gap-3 ">
        <Card className="chatWindow mt-3">
          <CardHeader>Rohan </CardHeader>
          <CardBody className="chatWindowBody pb-0">
            {chatMessages.map((item) => (
              <>
                {userInfo._id == item.sender ? (
                  <div className="chat-receiverMsg d-flex flex-column">
                    <p className="chat-receiverMsg-inner p-2">{item.text}</p>
                    <div className="">{format(item.createdAt)}</div>
                  </div>
                ) : (
                  <div className="chat-senderMsg d-flex flex-column ">
                    <p className="chat-senderMsg-inner p-2">{item.text}</p>
                    <div className="">{format(item.createdAt)}</div>
                  </div>
                )}
              </>
            ))}

            {messages.map((message) => (
              <div className="chat-receiverMsg">
                {/* <p className="chat-receiverMsg-inner p-2">{message}</p> */}
                <p
                  className="chat-receiverMsg-inner p-2"
                  dangerouslySetInnerHTML={{ __html: message }}
                ></p>
              </div>
            ))}
          </CardBody>
          <CardFooter className="d-flex align-items-center">
            <Form className="w-100">
              <InputGroup>
                <Form.Control
                  type="text"
                  style={{ display: showFontStyle ? 'none' : 'block' }}
                  placeholder="Type your message here..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div style={{ display: showFontStyle ? 'block' : 'none' }}>
                  <MyStatefulEditor markup="" onChange={onChange} />
                </div>
                <div className="d-flex justify-content-center align-items-center ps-2 ">
                  <RxFontStyle onClick={showFontStyleBox} />
                </div>
              </InputGroup>
            </Form>
            <IoSendSharp className="ms-3" onClick={handleSendMessage} />
          </CardFooter>
        </Card>
        <Card className="chatWindowProjectInfo mt-3">
          <CardHeader>Project Status</CardHeader>
          <CardBody> Project Status like ....on progress</CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ChatWindowScreen;

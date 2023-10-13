import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  InputGroup,
} from "react-bootstrap";
import { IoSendSharp } from "react-icons/io5";
import { RxFontStyle } from "react-icons/rx";
import MyStatefulEditor from "../Components/rte_test";
import { Store } from "../Store";
import { Socket, io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import {format} from "timeago.js"


function ChatWindowScreen() {
  const { id } = useParams();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversationID, setConversationID] = useState();
const [checkstate, setCheckstate] =useState(false)

  const socket = useRef(io("ws://localhost:8900"))
  const scrollRef = useRef()

  useEffect(()=>{
    socket.current= io("ws://localhost:8900")
    socket.current.on("getMessage",data=>{
      setArrivalMessage({
        sender:data.senderId,
        text:data.text,
        createdAt:Date.now()

      })
    })
  },[])
  
useEffect(()=>{
arrivalMessage  && conversationID?.members.includes(arrivalMessage.sender)&&
  setChatMessages((prev)=>[...prev , arrivalMessage])

},[arrivalMessage,conversationID])



useEffect(()=>{
  socket.current.emit("addUser",userInfo._id )
  socket.current.on("getUsers",users=>{
  })
},[])


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

  
  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.post(`/api/conversation/${id}`);
        setConversationID(data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversation();
  }, []);



  const showFontStyleBox = () => {
    setShowFontStyle(!showFontStyle);
  };
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = () => {
    const messageObject = { text: newMessage,sender:userInfo._id };
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, messageObject]);
      setNewMessage("");
    }
    submitHandler();
  };
  const onChange = (value) => {
    setNewMessage(value);
  };

  const submitHandler = async (e) => {
    
    const receiverdId = conversationID.members.find((member) => member !== userInfo._id);

    socket.current.emit("sendMessage",{
      senderId: userInfo._id,
      receiverdId:receiverdId,
      text:newMessage,
    })
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
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  },[chatMessages,newMessage])

  return (
    <div className=" d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-center gap-3 w-100 ">
        <Card    className="chatWindow mt-3">
          <CardHeader>Rohan </CardHeader>
          <CardBody className="chatWindowBody pb-0">
            {console.log('chatMessages ',chatMessages)}
            {chatMessages.map((item) => (
              <>
                {userInfo._id == item.sender ?  (
                  <div ref={scrollRef} className="chat-receiverMsg d-flex flex-column">
                    <p className="chat-receiverMsg-inner p-2" dangerouslySetInnerHTML={{ __html: item.text }}></p>
                    <div className="timeago">{format(item.createdAt)}</div>
                  </div>
                ) : (
                  <div ref={scrollRef} className="chat-senderMsg d-flex flex-column ">
                    <p className="chat-senderMsg-inner p-2" dangerouslySetInnerHTML={{ __html: item.text }}></p>
                    <div className="timeago">{format(item.createdAt)}</div>
                  </div>
                )}
              </>
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
                  <MyStatefulEditor markup="" value={newMessage}  onChange={onChange} />
                </div>
                <div className="d-flex justify-content-center align-items-center ps-2 ">
                  <RxFontStyle onClick={showFontStyleBox} />
                </div>
              </InputGroup>
            </Form>
            <IoSendSharp className="ms-3" onClick={handleSendMessage} />
          </CardFooter>
        </Card>
        <Card className="chatWindowProjectInfo mt-3" >
          <CardHeader>Project Status</CardHeader>
          <CardBody> Project Status like ....on progress</CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ChatWindowScreen;

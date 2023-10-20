import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';

function ChatWindowScreen() {
  const { id } = useParams();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversationID, setConversationID] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedfile, setSelectedfile] = useState(null);
  const [selectedFileAudio, setSelectedFileAudio] = useState(null);

  const [audioStream, setAudioStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const audioChunks = useRef([]);
  const audioRef = useRef();

  useEffect(() => {
    if (selectedfile && selectedfile.type) {
      const mediaType =
        selectedfile.type.includes('video') ||
        selectedfile.type.includes('audio')
          ? 'video'
          : 'image';

      //console.log('Media Type:', mediaType);
      setMediaType(mediaType);
    }
  }, [selectedfile]);

  const socket = useRef(io('ws://localhost:8900'));
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('audio', (data) => {
      console.log('audio ', data.audio);
      const audioBlob = new Blob([data.audio], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setArrivalMessage({
        sender: data.senderId,
        audio: audioUrl,
        createdAt: Date.now(),
      });
      setAudioStream(data.audio);
    });
    socket.current.on('audioFile', (data) => {
      console.log('audioFile ', data.audio);
      setArrivalMessage({
        sender: data.senderId,
        audio: data.audio,
        createdAt: Date.now(),
      });
      setAudioStream(data.audio);
    });
    socket.current.on('video', (data) => {
      console.log('vedoodile ', data.video);
      setArrivalMessage({
        sender: data.senderId,
        video: data.video,
        createdAt: Date.now(),
      });
      setAudioStream(data.video);
    });

    socket.current.on('image', (data) => {
      console.log('image', data);
      setArrivalMessage({
        sender: data.senderId,
        image: data.image,
        createdAt: Date.now(),
      });
    });
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      conversationID?.members.includes(arrivalMessage.sender) &&
      setChatMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conversationID]);

  const startRecording = (e) => {
    e.preventDefault(); // Prevent the form from submitting and the page from refreshing

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };
        const receiverdId = conversationID.members.find(
          (member) => member !== userInfo._id
        );
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: 'audio/wav',
          });
          //console.log('audiobulb', audioBlob);
          const messageData = {
            senderId: userInfo._id,
            receiverdId: receiverdId,
            audio: audioBlob,
          };
          //console.log('messageData', messageData);
          socket.current.emit('audio', messageData);
          // socket.current.emit('audio', audioBlob);
          audioChunks.current.length = 0;

          const formDatas = new FormData();
          formDatas.append('media', audioBlob);
          formDatas.append('mediaType', 'video');
          formDatas.append('conversationId', id);
          formDatas.append('sender', userInfo._id);

          try {
            const { data } = await axios.post('/api/message/audio', formDatas);
          } catch (err) {
            console.log(err.response?.data?.message);
          }
        };

        recorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing the microphone:', error);
        setIsRecording(false); // Ensure that the button is disabled in case of an error
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    socket.current.emit('addUser', userInfo._id);
    socket.current.on('getUsers', (users) => {});
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/message/${id}`);
        setChatMessages(data);
      } catch (err) {
        //console.log(err);
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
        //console.log(err);
      }
    };

    getConversation();
  }, []);

  const showFontStyleBox = () => {
    setShowFontStyle(!showFontStyle);
  };
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = async () => {
    const messageObject = { text: newMessage, sender: userInfo._id };
    if (newMessage.trim() !== '') {
      setChatMessages([...chatMessages, messageObject]);
      setNewMessage('');
    }

    submitHandler();
  };
  const onChange = (value) => {
    setNewMessage(value);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('file ', file.type);

    if (file.type.includes('image')) {
      setSelectedfile(file);
    } else if (file.type.includes('audio')) {
      setSelectedFileAudio(file);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      // Handle the file data based on its type
      const base64Data = event.target.result;

      //setSelectedImage(base64Data);
      if (file.type.includes('image')) {
        // Handle image data
        setSelectedImage(base64Data);
      } else if (file.type.includes('audio')) {
        setSelectedAudio(base64Data);
      } else if (file.type.includes('video')) {
        console.log('videpo');
        // Handle video data
        setSelectedVideo(base64Data);
      }
    };

    reader.readAsDataURL(file);
  };

  // console.log('selectedAudio', selectedAudio);
  // console.log('selectedImage', selectedImage);
  console.log('selectedVideo', selectedVideo);
  // console.log('selctedfile', selectedfile);
  const submitHandler = async (e) => {
    const receiverdId = conversationID.members.find(
      (member) => member !== userInfo._id
    );

    if (selectedImage) {
      const messageData = {
        senderId: userInfo._id,
        receiverdId: receiverdId,
        image: selectedImage,
      };
      socket.current.emit('image', messageData);
      const formDatas = new FormData();
      formDatas.append('media', selectedfile);
      formDatas.append('mediaType', mediaType);
      formDatas.append('conversationId', id);
      formDatas.append('sender', userInfo._id);
      formDatas.append('text', newMessage);
      try {
        const { data } = await axios.post('/api/message/', formDatas);
      } catch (err) {
        console.log(err.response?.data?.message);
      }

      setSelectedImage(null);
    } else if (selectedAudio) {
      const messageData = {
        senderId: userInfo._id,
        receiverdId: receiverdId,
        audio: selectedAudio,
      };
      socket.current.emit('audioFile', messageData);
      const formDatas = new FormData();
      formDatas.append('media', selectedFileAudio);
      formDatas.append('mediaType', 'video');
      formDatas.append('conversationId', id);
      formDatas.append('sender', userInfo._id);
      formDatas.append('text', newMessage);
      try {
        const { data } = await axios.post('/api/message/audio', formDatas);
        setSelectedAudio(null);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    } else if (selectedVideo) {
      console.log('videodataemittttttlatttfirtsttsssss');

      const messageData = {
        senderId: userInfo._id,
        receiverdId: receiverdId,
        video: selectedVideo,
      };
      socket.current.emit('video', messageData);
      console.log('videodataemittttttlattt');
      setSelectedVideo(null);
    } else {
      socket.current.emit('sendMessage', {
        senderId: userInfo._id,
        receiverdId: receiverdId,
        text: newMessage,
      });
      try {
        const { data } = await axios.post('/api/message/', {
          conversationId: id,
          sender: userInfo._id,
          text: newMessage,
        });
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, newMessage]);

  //console.log('selected image', selectedImage);

  return (
    <div className=" justify-content-center align-items-center">
      <div className="d-flex justify-content-center gap-3 ">
        <Card className="chatWindow mt-3">
          <CardHeader>Rohan </CardHeader>
          <CardBody className="chatWindowBody pb-0">
            {chatMessages.map((item) => (
              <>
                {userInfo._id == item.sender ? (
                  <>
                    {item.text ? (
                      <div
                        ref={scrollRef}
                        className="chat-receiverMsg d-flex flex-column"
                      >
                        <p
                          className="chat-receiverMsg-inner p-2"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        ></p>
                        <div className="timeago">{format(item.createdAt)}</div>
                      </div>
                    ) : (
                      <div
                        ref={scrollRef}
                        className="chat-receiverMsg d-flex flex-column"
                      >
                        {item.audio ? (
                          <audio
                            className="chat-receiverMsg-inner w-100 p-2"
                            controls
                          >
                            <source src={item.audio} type="audio/wav" />
                          </audio>
                        ) : (
                          <>
                            {item.video ? (
                              <video
                                className="chat-receiverMsg-inner w-100 p-2"
                                controls
                              >
                                <source src={item.video} type="video/mp4" />
                              </video>
                            ) : (
                              <img
                                src={
                                  item.conversationId
                                    ? item.image
                                    : `http://localhost:4500/${item.image}`
                                }
                                className="chat-receiverMsg-inner w-100 p-2"
                              />
                            )}
                          </>
                        )}

                        <div className="timeago">{format(item.createdAt)}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.text ? (
                      <div
                        ref={scrollRef}
                        className="chat-senderMsg d-flex flex-column "
                      >
                        <p
                          className="chat-senderMsg-inner p-2"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        ></p>
                        <div className="timeago">{format(item.createdAt)}</div>
                      </div>
                    ) : (
                      <div
                        ref={scrollRef}
                        className="chat-senderMsg d-flex flex-column "
                      >
                        {item.audio ? (
                          <audio
                            className="chat-senderMsg-inner w-100 p-2"
                            controls
                          >
                            <source src={item.audio} type="audio/wav" />
                          </audio>
                        ) : (
                          <>
                            {item.video ? (
                              <video
                                className="chat-senderMsg-inner w-100 p-2"
                                controls
                              >
                                <source src={item.video} type="video/mp4" />
                              </video>
                            ) : (
                              <img
                                src={
                                  item.conversationId
                                    ? item.image
                                    : `http://localhost:4500/${item.image}`
                                }
                                className="chat-senderMsg-inner w-100 p-2"
                              />
                            )}
                          </>
                        )}
                        <div className="timeago">{format(item.createdAt)}</div>
                      </div>
                    )}
                  </>
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
                  <MyStatefulEditor
                    markup=""
                    value={newMessage}
                    onChange={onChange}
                  />
                </div>
                <Form.Control onChange={handleFileChange} type="file" />
                <div className="App d-flex align-items-center ps-2">
                  <BsFillMicFill
                    onClick={startRecording}
                    disabled={isRecording}
                    style={{ display: isRecording ? 'none' : 'block' }}
                  />

                  <BsFillMicMuteFill
                    onClick={stopRecording}
                    disabled={!isRecording}
                    style={{ display: !isRecording ? 'none' : 'block' }}
                  />
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

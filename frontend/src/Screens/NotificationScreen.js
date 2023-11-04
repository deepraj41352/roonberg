import React, { useContext, useEffect, useRef } from 'react'
import { Socket, io } from "socket.io-client";
import { Store } from '../Store';


export default function NotificationScreen() {

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { toggleState, userInfo, NotificationData } = state;
    console.log("object", NotificationData)
    const socket = io("ws://localhost:8900");
    socket.on('connectionForNotify', (data) => {
        // Display a notification to the user in their dashboard
        // You can update the UI, show a notification popup, or perform other actions.
        console.log("oiuhjioyhi", data);
    });

    useEffect(() => {

        socket.on("notifyProjectFrontend", (notifyUser, message) => {
            console.log("getnotification", notifyUser, message)

            if (notifyUser == userInfo._id) {
                ctxDispatch({ type: "NOTIFICATION", payload: { notifyUser, message } });
            }
        });
    }, []);

    return (
        <div>
            hello
        </div>
    )
}

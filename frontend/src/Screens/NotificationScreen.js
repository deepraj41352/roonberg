import React, { useRef } from 'react'
import { Socket, io } from "socket.io-client";


export default function NotificationScreen() {

    const socket = useRef(io("ws://localhost:8900"));
    socket.on('newEmail', (data) => {
        // Display a notification to the user in their dashboard
        // You can update the UI, show a notification popup, or perform other actions.
        console.log("oiuhjioyhi", data);
    });

    return (
        <div>
            hello
        </div>
    )
}

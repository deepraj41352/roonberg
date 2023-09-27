import React, { useContext } from 'react'
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
export default function ProtectedRoute({ children }) {
    const { state } = useContext(Store);
    const navigater = useNavigate();
    const { userInfo } = state;
    return userInfo ? children : navigater("/");
}


import React, { createContext, useReducer } from 'react';

export const Store = createContext();

const initialValue = {

}

const reducer = (state, action) => {
    switch (action.type) {

    }

}


export default function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialValue);
    const value = { state, dispatch }
    return (
        <Store.Provider value={value}>{props.children}</Store.Provider>
    )
}


//context - compartilhar dados de forma global entre componentes

import React, { createContext, useEffect, useState } from 'react';

import history from '../services/history';

import api from '../config/configApi';

const Context = createContext();

function AuthProvider({ children }) {

    const [authenticated, setAuthenticated] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getLogin = async () => {

            //recuperar o token
            const token = localStorage.getItem('token');

            if (token) {
                api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
                setAuthenticated(true);
            }
            setLoading(false);
        }

        getLogin();

    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    async function signIn(sit) {
        setAuthenticated(sit);
    }

    //FAZER LOGOUT DA PÁGINA  
    function handleLogout() {
        setAuthenticated(false);
        localStorage.removeItem('token');
        api.defaults.headers.Authorization = undefined;

        return history.push('/'); //redireciona a página

    }
    return (
        <Context.Provider value={{ authenticated, handleLogout, signIn }}>
            {children}
        </Context.Provider>
    )

}

export { Context, AuthProvider };
import React, { useContext } from 'react';
import './dashboard.css';
import { Context } from '../../Context/AuthContext';

export const Dashboard = () => {
    const { handleLogout } = useContext(Context);
    return (
        <div id='container'>
            <h1>Dashboard</h1>
            <button type="button" onClick={handleLogout}>Sair</button>
        </div>
    )
}
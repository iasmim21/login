import React, { useState, useContext } from 'react';
import './login.css';
import { MdEmail, MdLock } from "react-icons/md";
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useHistory } from 'react-router-dom';
import { Context } from '../../Context/AuthContext';
import api from '../../config/configApi';

export const Login = () => {

    const history = useHistory();

    const { signIn } = useContext(Context);

    const [dataUser, setUser] = useState({
        user: '',
        password: ''
    });

    const [status, setStatus] = useState({
        type: '',
        message: ''
    });

    const valorInput = e => setUser({ ...dataUser, [e.target.name]: e.target.value });

    const loginSubmit = async e => {
        e.preventDefault();

        //conectar com a api
        const headers = {
            'Content-Type': 'application/json'
        };

        api.post("/login", dataUser, { headers })
            .then((res) => {
                if (res.data.erro) {
                    setStatus({
                        type: 'erro',
                        message: res.data.message
                    });
                } else {
                    setStatus({
                        type: 'success',
                        message: res.data.message
                    });

                    //salvar o token no localStorage
                    localStorage.setItem('token', JSON.stringify(res.data.token));
                    api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

                    signIn(true);// usuário conseguiu realizar o login

                    //redirecionar para pagina inicial
                    return history.push('/dashboard');
                }
            }).catch(() => {
                setStatus({
                    type: 'erro',
                    message: "Erro: Usuário ou senha incorretos"
                });
            });
    }

    const [show, setShow] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        setShow(!show)
    }
    return (
        <div className="login">
            <div className="login-logo">
                <img src="https://img.icons8.com/cotton/452/difficult-decision.png" alt="Login App" />
            </div>
            <form onSubmit={loginSubmit}>
                <div className="login-right">
                    <h1>Login</h1>


                    <div className="login-input-email">
                        <MdEmail />
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            name="user"
                            onChange={valorInput} />
                    </div>

                    <div className="login-input-password">
                        <MdLock />
                        <input
                            type={show ? "text" : "password"}
                            placeholder="Digite sua senha"
                            name="password"
                            autoComplete="on"
                            onChange={valorInput}
                        />

                        {/* botão de ocultar e mostrar senha */}
                        <div className="login-eye">
                            {show ? (<HiEye onClick={handleClick} />) : (<HiEyeOff onClick={handleClick} />)}
                        </div>
                    </div>

                    {status.type === 'erro' ? <p>{status.message}</p> : ""}
                    {status.type === 'success' ? <p>{status.message}</p> : ""}

                    <button type="submit">Entrar</button>
                </div>
            </form>
        </div>
    );
}

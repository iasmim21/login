import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Context } from '../Context/AuthContext';

export default function RoutesAdm() {

    function CustomRoute({ isPrivate, ...rest }) {
        const { authenticated } = useContext(Context);

        //verificar se a rota é privada e o usuário não está logado
        if (isPrivate && !authenticated) {
            return <Redirect to='/' />//redireciona para o login
        }

        // se o usuário estiver logado ou a página não for privada ele carega todas as rotas
        return <Route {...rest} />

    }

    return (
        <Switch>
            <CustomRoute exact path='/' component={Login} />
            <CustomRoute isPrivate exact path='/dashboard' component={Dashboard} />
        </Switch>
    )
}
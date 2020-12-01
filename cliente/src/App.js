import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext'
import Navigation from './componentes/Navigation/Navigation'
import Registro from './componentes/Registro/Registro'
import Principal from './componentes/Principal/Principal'
import Home from './componentes/Home/Home'
class App extends Component {
    
    render() {
        return (
            <UserContextProvider >
                <Router >
                    <Navigation></Navigation>
                    <Route component={Registro} path='/registro'></Route>
                    <Route component={Home} path='/home'></Route>
                    <Route component={Principal} path='/' exact></Route>
                </Router>
            </UserContextProvider >
        );
    }
}

export default App
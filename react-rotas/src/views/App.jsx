import './App.css'
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css'

import Menu from '../components/layout/Menu';
import Content from '../components/layout/Content';

const App = props => {
    return (

    <div className="container">
        <Router>
            <Menu />
            <Content />
        </Router>
    </div>
    )
}

export default App;
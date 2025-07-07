import './Menu.css'
import React from "react";
import { Link } from 'react-router-dom';

const Menu = props => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <i className="fa fa-calendar-check-o"></i> Todo App
                </Link>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/todos">Todo</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">Sobre</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Menu;
import './Content.css'
import React from "react";
import { Routes, Route } from 'react-router-dom';

import About from '../../views/examples/About'
import Home from '../../views/examples/Home'
import Param from '../../views/examples/Param'
import Todo from '../../views/todo/Todo'
import NotFound from '../../views/examples/NotFound';

const Content = props => {
    return (
    <main className="Content">
        <Routes>
            <Route path='/about' element={<About />} />
            <Route path='/param/:id' element={<Param />} />
            <Route path='/todos' element={<Todo />} />
            <Route path='/' exact element={<Home />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </main>
    )
}

export default Content;
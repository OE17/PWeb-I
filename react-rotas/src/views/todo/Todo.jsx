import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../examples/pageHeader'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

const URL  = "http://localhost:8080/p6/api/todos/"
const URL2 = "http://localhost:8080/p6/api/todos/list/"
const URL3 = "http://localhost:8080/p6/api/todos/apaga"

export default class Todo extends Component {
    constructor(props) {
        super(props)
        this.state = { description: '', list: [] }
        this.handleChange = this.handleChange.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleRemove = this.handleRemove.bind(this)

        this.refresh()
    }

    handleChange(e) {
        this.setState({...this.state, description: e.target.value })
    }

    handleAdd() {
        const description = this.state.description
        axios.post(URL, { description })
        .then(resp => this.refresh())
        .catch(err => {
            console.error('Erro ao adicionar tarefa:', err);
            alert('Erro ao adicionar tarefa');
        })
    }

    handleRemove(todo) {
        axios.delete(`${URL3}?id=${todo.id}`)
            .then(resp => this.refresh())
            .catch(err => {
                console.error('Erro ao remover tarefa:', err);
                alert('Erro ao remover tarefa');
            })
    }

    refresh() {
        axios.get(`${URL2}`)
            .then(resp => this.setState({...this.state, description: '', list: resp.data}))
            .catch(err => {
                console.error('Erro ao carregar tarefas:', err);
                alert('Erro ao carregar tarefas');
            })
    }
    
    render(){
        return(
            <div>
                <PageHeader name="Tarefas" small="Cadastro"/>
                <TodoForm description={this.state.description} 
                    handleChange={this.handleChange}
                    handleAdd={this.handleAdd} />
                 <TodoList list={this.state.list} handleRemove={this.handleRemove} />
            </div>
        )
    }
}
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let todos = [
    { id: 1, description: 'Exemplo de tarefa 1' },
    { id: 2, description: 'Exemplo de tarefa 2' }
];

// Listar todas as tarefas
app.get('/p6/api/todos/list/', (req, res) => {
    console.log('GET - Listando tarefas:', todos);
    res.json(todos);
});

// Adicionar nova tarefa
app.post('/p6/api/todos/', (req, res) => {
    const { description } = req.body;
    const id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const newTodo = { id, description };
    todos.push(newTodo);
    console.log('POST - Tarefa adicionada:', newTodo);
    res.json({ success: true });
});

// Remover tarefa
app.delete('/p6/api/todos/apaga', (req, res) => {
    const id = parseInt(req.query.id);
    console.log('DELETE - Tentando remover tarefa com id:', id);
    const todoAntes = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    const todoDepois = todos.length;
    
    if (todoAntes > todoDepois) {
        console.log('Tarefa removida com sucesso');
        res.json({ success: true });
    } else {
        console.log('Tarefa não encontrada');
        res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Tarefas iniciais:', todos);
}); 
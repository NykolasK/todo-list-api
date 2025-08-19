require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todosRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'API Todo List funcionando!',
        version: '1.0.0',
        endpoints: {
            'GET /todos': 'Listar todos os todos',
            'GET /todos/:id': 'Buscar todo por ID',
            'POST /todos': 'Criar novo todo',
            'PUT /todos/:id': 'Atualizar todo',
            'DELETE /todos/:id': 'Deletar todo'
        }
    });
});

app.use('/todos', todosRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.originalUrl} não existe`
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Algo deu errado!'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📋 API Todo List disponível em http://localhost:${PORT}`);
});

module.exports = app;

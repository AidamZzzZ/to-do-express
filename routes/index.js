const express = require('express')
const app = express()
const PORT = 3001

const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let tasks = [
    {
      id: 1,
      title: 'Aprender los fundamentos de Express',
      completed: true,
    },
    {
      id: 2,
      title: 'Crear rutas GET y POST',
      completed: false,
    },
    {
      id: 3,
      title: 'Simular base de datos en memoria',
      completed: false,
    },
    {
      id: 4,
      title: 'Probar la API con Postman',
      completed: true,
    }
];

const randomId = () => {
    let letters = "ABCDEFGHIJKMNLOPQRSTUVWXYZabcdefghijkmnolprstuvwxyz0123456789"
    let id = "";
    for (let i = 0; i < 6; i++) {
        id += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    return id
}

app.get('/api/tasks', (request, response) => {
    response.json(tasks)
})

app.get('/api/tasks/:id', (request, response) => {
    const id = Number(request.params.id)
    const task = tasks.find(task => task.id === id)
    
    if (!task) {
        return response.status(404).end()
    }
    response.json(task)
})

app.post('/api/tasks', (request, response) => {
    const  body = request.body

    if (!body.title) return response.status(409).json({ message: "Empty title" })
    
    const task = {
        id: randomId(),
        title: body.title,
        completed: false
    }

    tasks = tasks.concat(task)
    console.log(task, tasks)
    response.json(tasks)
})

app.put('/api/tasks/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body
    const task = tasks.find(task => task.id === id)

    if (task) {
        task.title = body.title
        task.completed = body.completed
        response.json(task)
    } else {
        return response.status(404).json({ message: "Task does not exist" })
    }
    console.log(id, body, task)
})

app.delete('/api/tasks/:id', (request, response) => {
    const id = Number(request.params.id)
    const index = tasks.findIndex(task => task.id === id)
    
    if (index !== -1) {
        tasks.splice(index, 1)
        response.status(204).end()
    } else {
        response.status(404).json({ message: 'Task does not exist' })
    }
})

app.listen(PORT, () => console.log(`Server running in port ${PORT}`))
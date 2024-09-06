const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Importing CORS to handle cross-origin issues

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

const url = 'mongodb+srv://patelheta2512:cbx7EmgcTVmIphtR@cluster0.vtk6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'mydatabase';

// Enable CORS to allow frontend requests from different origins
app.use(cors());
app.use(express.json());  // To parse JSON payloads
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB using async/await
async function connectToDb() {
    try {
        const client = await MongoClient.connect(url);
        console.log('Connected successfully to MongoDB server');
        const db = client.db(dbName);

        // API to add expenses
        app.post('/expenses', async (req, res) => {
            try {
                const { name, amount, description, time } = req.body;
                const result = await db.collection('expenses').insertOne({ name, amount, description, time });

                // Emit a 'newExpense' event to all connected clients
                io.emit('newExpense', { name, amount, description, time });

                res.sendStatus(200);
            } catch (error) {
                console.error('Failed to add expense:', error);
                res.sendStatus(500);
            }
        });

        // API to fetch expenses
        app.get('/expenses', async (req, res) => {
            try {
                const expenses = await db.collection('expenses').find().toArray();
                res.json(expenses);
            } catch (error) {
                console.error('Failed to fetch expenses:', error);
                res.sendStatus(500);
            }
        });

        // Start the server
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}

connectToDb();

// Socket.io setup for real-time communication
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

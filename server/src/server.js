const app = require('./app');

const mongoose = require('mongoose');

const http = require('http');

const { loadPlanetsData } = require('./model/planets.model');

const port = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:2SWSRC8mEKdxNJ1O@nasa-cluster.apflp.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('Connection Ready');
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(port,()=>{console.log(`Server is listening on port ${port}`)});
}

startServer();


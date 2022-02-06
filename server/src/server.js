const app = require('./app');

const http = require('http');

const { loadPlanetsData } = require('./model/planets.model');

const port = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await loadPlanetsData();

    server.listen(port,()=>{console.log(`Server is listening on port ${port}`)});
}

startServer();


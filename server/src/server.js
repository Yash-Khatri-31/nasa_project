const app = require('./app');

const http = require('http');

const { loadPlanetsData } = require('./model/planets.model');

const {mongoConnect} = require('./services/mongo')

const port = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    server.listen(port,()=>{console.log(`Server is listening on port ${port}`)});
}

startServer();


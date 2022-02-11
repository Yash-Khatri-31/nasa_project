const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:2SWSRC8mEKdxNJ1O@nasa-cluster.apflp.mongodb.net/nasa?retryWrites=true&w=majority';


mongoose.connection.once('open',() => {
    console.log('Connecting')
})
mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect(){
    return await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    return await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};
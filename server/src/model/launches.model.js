// const launches = new Map();

const launches = require('./launches.mongo') 
const planets = require('./planets.mongo')
const axios = require('axios');

// let latestFlightNumber = 100;

const defaultFlightNumber = 100;

// const launch = {
//     flightNumber:100,
//     mission:'Kepler Exploration X',
//     rocket:'Explorer IS1',
//     launchDate:new Date('December 27,2030'),
//     target:'Kepler-1652 b',
//     customers:['ZTM','NASA'],
//     upcoming:true,
//     success:true
// }

// launches.set(launch.flightNumber,launch);

async function getAllLaunches(){
    // return Array.from(launches.values());
    return await launches.find({}, {
        '_id':0 , '__v':0
    })
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        kepler_name: launch.target
    })
    if(!planet){
        throw new Error('No matching planet');
    }
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

// saveLaunch(launch)

async function getLatestFlightNumber(){
    const latestLaunch = await launches.findOne().sort('-flightNumber')

    if(!latestLaunch){
        return defaultFlightNumber;
    }
    return latestLaunch.flightNumber;

    //if there is no launch we still want to create with a flight number
}

async function scheduleNewLaunch(launch){

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM' , 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(latestFlightNumber,Object.assign(launch,
//         {
//             flightNumber:latestFlightNumber,
//             upcoming:true,
//             customers:['ZTM','NASA'],
//             success:true
//         })
//     );
// };

async function existsLauchWithId(launchid){
    // return launches.has(launchid);
    return await launches.findOne({
        flightNumber: launchid
    })
}

async function abortLaunchById(launchid){

    const aborted = await launches.updateOne({
        flightNumber: launchid
    },{
        upcoming: false,
        success: false
    })
    // const aborted = launches.get(launchid);
    // aborted.success = false;
    // aborted.upcoming = false;
    // return aborted

    return aborted.modifiedCount === 1;
}

async function loadLaunchData(){

    const url = 'https://api.spacexdata.com/v4/launches/query'
    console.log('Downloading data from spacex api');
    const response = await axios.post(url,{
        query:{},
        options:{
            populate:[
                {
                    path:'rocket',
                    select:{
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers':1
                    }
                }
            ]
        }
    })

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        }
        console.log(`${launch.flightNumber} , ${launch.mission}`)
    }
}

module.exports = { 
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    loadLaunchData,
    existsLauchWithId,
    abortLaunchById
};
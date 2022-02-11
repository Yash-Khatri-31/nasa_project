// const launches = new Map();

const launches = require('./launches.mongo') 
const planets = require('./planets.mongo')

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

module.exports = { 
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    existsLauchWithId,
    abortLaunchById
};
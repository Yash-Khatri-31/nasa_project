const launches = new Map();

// const launches = require('./launches.mongo') 

let latestFlightNumber = 100;

const launch = {
    flightNumber:100,
    mission:'Kepler Exploration X',
    rocket:'Explorer IS1',
    launchDate:new Date('December 27,2030'),
    target:'Kepler-441 b',
    customers:['ZTM','NASA'],
    upcoming:true,
    success:true
}

launches.set(launch.flightNumber,launch);

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber,Object.assign(launch,
        {
            flightNumber:latestFlightNumber,
            upcoming:true,
            customers:['ZTM','NASA'],
            success:true
        })
    );
};

function existsLauchWithId(launchid){
    return launches.has(launchid);
}

function abortLaunchById(launchid){
    const aborted = launches.get(launchid);
    aborted.success = false;
    aborted.upcoming = false;
    return aborted
}

module.exports = { 
    getAllLaunches,
    addNewLaunch,
    existsLauchWithId,
    abortLaunchById
};
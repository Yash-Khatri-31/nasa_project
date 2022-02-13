const {getAllLaunches, addNewLaunch, existsLauchWithId, abortLaunchById, scheduleNewLaunch} = require('../../model/launches.model');

const {getPagination} = require('../../services/query');

async function httpGetAllLaunches(req,res) {

    const {skip, limit} = getPagination(req.query);
    return res.status(200).json( await getAllLaunches(skip,limit));
}

async function httpAddNewLaunch(req,res){
    
    const launch = req.body;
    if(!launch.mission){
        return res.status(400).json({
            err:'Missing required Mission'
        })
    }    if(!launch.rocket){
        return res.status(400).json({
            err:'Missing required Rocket'
        })
    }    if(!launch.target){
        return res.status(400).json({
            err:'Missing required Target'
        })
    }
    if(!launch.launchDate){
        return res.status(400).json({
            err:'Missing required launchDate'
        })
    }
    launch.launchDate = new Date(launch.launchDate)

    if(isNaN(launch.launchDate)){
        return res.status(400).json({err:'Invalid launch date'})
        //a valid date cannot be converted to number, i think
    }

    await scheduleNewLaunch(launch);
    console.log(launch)
    return res.status(200).json(launch)

    // addNewLaunch(launch);
    // return res.status(201).json(launch)
}

async function httpAbortLaunch(req,res){
    const launchid = Number(req.params.id);
    const launchExists = await existsLauchWithId(launchid);
    if(!launchExists){
        return res.status(404).json({
            err:"Launch not found"
        })
    }

    const aborted = await abortLaunchById(launchid)
    if(!aborted){
        return res.status(400).json({error:"Launch not aborted ok/nModified not valid"})
    }
    return res.status(200).json({ok:true});
} 

module.exports = {httpGetAllLaunches , httpAddNewLaunch, httpAbortLaunch};
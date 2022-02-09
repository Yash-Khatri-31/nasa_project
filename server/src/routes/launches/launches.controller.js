const {getAllLaunches, addNewLaunch, existsLauchWithId, abortLaunchById} = require('../../model/launches.model');

function httpGetAllLaunches(req,res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req,res){
    
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

    addNewLaunch(launch);
    return res.status(201).json(launch)
}

function httpAbortLaunch(req,res){
    const launchid = Number(req.params.id);
    if(!existsLauchWithId(launchid)){
        return res.status(404).json({
            err:"Launch not found"
        })
    }

    const aborted =abortLaunchById(launchid)
    return res.status(200).json(aborted);
} 

module.exports = {httpGetAllLaunches , httpAddNewLaunch, httpAbortLaunch};
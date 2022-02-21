const api_url = 'v1';

async function httpGetPlanets() {
  const response = await fetch(`${api_url}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  const response = await fetch(`${api_url}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber
  });

}

async function httpSubmitLaunch(launch) {
  console.log("launch in http",launch)
  try{
    return await fetch(`${api_url}/launches` , {
      method:"post",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(launch),
    });
  } catch(err){
    return {
      ok:false,
    };
  }
}
  // Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    return await fetch(`${api_url}/launches/${id}`,{
      method:"delete",
    })
  }catch(err){
    console.log(err)
    return {
      ok:false
    }
  }
}

// if the above code works fine the response will be status 200 which is true or else we set it as false.

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
'use restrict'

function initializeUser(data) {
    console.log("initialize user:");
    console.log(data);
    //console.log(data.userInfo);
}

function getUserTrack(openid) {

}

module.exports = {
    initializeUser = initializeUser,
    getUserTrack = getUserTrack
}
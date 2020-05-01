const isAuthorized = async(event) => {
    //TODO authorization logic
    console.log( 'TOKEN -- ' + event.headers.Authorization);
    return true;
}

module.exports = {
    isAuthorized
}
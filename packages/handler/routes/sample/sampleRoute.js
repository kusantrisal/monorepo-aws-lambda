const responseBuilder = require('@local/utils').responseBuilder;

exports.handler = async (event, context) => {
    return responseBuilder.Success(JSON.stringify({ response: 'Hello from sample route' }))
}
//base response object
const defaultHeader = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Origin,Access-Control-Request-Headers,Access-Control-Request-Method,Referer,Sec-Fetch-Mode,User-Agent',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE,PUT',
    'Content-Type': 'application/json'
};
exports.Response = function Response() {
    return {
        statusCode: "",
        headers: defaultHeader,
        body: {
            'error': {
                'errorCode': '',
                'message': ''
            },
            'payload': {}
        }
    }
}
// HTTP 2XX //
exports.CORSResponse = function CORSResponse() {
    return {
        statusCode: 200,
        headers: defaultHeader
    }
}
exports.Success = function Success(body) {
    return {
        statusCode: 200,
        headers: defaultHeader,
        body: body
    }
}
// HTTP 3XX //
exports.Redirect = function Redirect(location) {
    return {
        statusCode: 301,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Origin,Access-Control-Request-Headers,Access-Control-Request-Method,Referer,Sec-Fetch-Mode,User-Agent',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE,PUT',
            'Location': location
        }
    }
}
// HTTP 4XX //
exports.BadRequest = function BadRequest(message) {
    return {
        statusCode: 400,
        body: JSON.stringify({ error: { errorCode: '400', message: !message ? "BadRequest." : message } }),
        headers: defaultHeader
    }
}
exports.Unathorized = function Unathorized(message) {
    return {
        statusCode: 401,
        body: JSON.stringify({ error: { errorCode: '401', message: !message ? "Unathorized." : message } }),
        headers: defaultHeader
    }
}
exports.Forbidden = function Forbidden(message) {
    return {
        statusCode: 403,
        body: JSON.stringify({ error: { errorCode: '403', message: !message ? "Forbidden." : message } }),
        headers: defaultHeader
    }
}
exports.NotFound = function NotFound(message) {
    return {
        statusCode: 404,
        body: JSON.stringify({ error: { errorCode: '404', message: !message ? "NotFound." : message } }),
        headers: defaultHeader
    }
}
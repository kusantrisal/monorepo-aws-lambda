const sampleModule = require('@local/sampleModule');
const { responseBuilder, authService } = require('@local/utils');
const routes = require('./routes');

exports.handler = async (event, context) => {
console.log(event);
    if (authService.isAuthorized(event)) {
        console.log(event)
        switch (event.httpMethod) {
            //CORS handler
            case "OPTIONS":
                return responseBuilder.CORSResponse();
            case "GET":
                switch (event.path) {
                    case "/health":
                        return await routes.sampleRoute.handler(event, context);
                    default:
                        return responseBuilder.NotFound("Route Not Found");
                }
            case "POST":
                switch (event.path) {
                    case "/health":
                        return responseBuilder.Success(sampleModule.substract(5, 3));
                    default:
                        return responseBuilder.NotFound("Route Not Found");
                }
        }

    } else {
        return responseBuilder.Unathorized('token is missing or is invalid');
    }

}
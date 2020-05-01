const handler = require('@local/handler').handler;
const { authService } = require('@local/utils');

beforeEach(() => {
    //mock only the method isAuthorized
    authService.isAuthorized = jest.fn().mockReturnValue(true);
});

test("trigger handler", async () => {
    event = {
        httpMethod: 'GET',
        path: '/health',
        headers: {
            Authorization: "Bearer something"
        }
    };
    const response = await handler(event, null);
    console.log(response);
    // expect(response)
    //     .toEqual({
    //         body: '{\"respone\":\"Hello from mock\"}',
    //         statusCode: 200
    //     });
});
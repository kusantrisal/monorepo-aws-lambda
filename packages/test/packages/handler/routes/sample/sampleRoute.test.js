const sampleRoute = require('@local/handler/routes').sampleRoute;
const responseBuilder = require('@local/utils').responseBuilder;
jest.mock("@local/utils")

beforeEach(() => {
    responseBuilder.Success.mockReset();
});

test.skip("trigger handler", async () => {
    responseBuilder.Success.mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify({ respone: 'Hello from mock' })
    });

    event = {
        headers: {
            Authorization: "Bearer something"
        },
        queryStringParameters: {
            search: "eyJ0ZXN0IjoidGVzdCJ9"
        }
    };
    const response = await sampleRoute.handler(event, null);
    console.log(response);
    expect(response)
        .toEqual({
            body: '{\"respone\":\"Hello from mock\"}',
            statusCode: 200
        });


});
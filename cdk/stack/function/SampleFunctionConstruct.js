const core = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const path = require('path');
const api = require('@aws-cdk/aws-apigateway');

let lambdaFunction;
const PREFIX = process.env.PREFIX;

module.exports = class SampleFunctionConstruct extends core.Construct {
    constructor(scope, id, props, role) {
        super(scope, id, props);

        lambdaFunction = new lambda.Function(this, 'functionConstructname', {
            functionName: 'sampleApi',
            runtime: lambda.Runtime.NODEJS_12_X,
            code: new lambda.AssetCode(path.resolve(`${path.resolve()}/packages/handler`)),
            handler: 'index.handler',
            role: role,
            timeout: core.Duration.seconds(300),
            memorySize: 3008,
            environment: {
                STAGE: process.env.PREFIX,
                TABLE_NAME: `${PREFIX}_${process.env.TABLE_NAME}`
            }
        });

        const version = lambdaFunction.addVersion(new Date().toISOString());
        const alias = new lambda.Alias(this, 'LambdaAlias', {
            aliasName: 'dev',
            version,
        });

        new api.LambdaRestApi(this, 'sampleApiConstruct', {
            restApiName: 'sampleApi',
            handler: lambdaFunction,
            description: 'desc'
        });
    }

    getFunction() {
        return lambdaFunction;
    }
}
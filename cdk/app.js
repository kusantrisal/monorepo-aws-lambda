const cdk = require('@aws-cdk/core');
const { Stack } = require('./stack/Stack');

module.exports = class App extends cdk.App {
    constructor(argv) {
        super(argv);
        new Stack(this, 'myStack', {
            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_DEFAULT_REGION
            }
        });
    }
}
const core = require('@aws-cdk/core');
const StackRoleConstruct = require('./iam/StackRoleConstruct');
const SampleFunctionConstruct = require('./function/SampleFunctionConstruct');

class Stack extends core.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        console.log('Deploying stactk')
        //create role
        const stackRole = new StackRoleConstruct(this, 'roleName', props);
        const sampleFunction = new SampleFunctionConstruct(this, 'functionName', props, stackRole.getRole());
    }
}
module.exports = {
    Stack
}
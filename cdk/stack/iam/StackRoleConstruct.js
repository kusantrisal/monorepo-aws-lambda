const core = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');

let role;

module.exports = class StackRoleConstruct extends core.Construct {
    constructor(scope, id, props) {
        super(scope, id);

        role = new iam.Role(this, 'StackRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
        })
        role.addToPolicy(new iam.PolicyStatement({
            resources: [
                '*'
            ],
            actions: [
                'ses:SendEmail',
                'sns:Publish',
                's3:PutObject',
                's3:GetObject',
                's3:DeleteObject',
                'dynamodb:Scan',
                'dynamodb:Query',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'lambda:*',
                'apigateway:*',
                'execute-api:Invoke',
                'execute-api:ManageConnections',
                'logs:*'
            ]
        }));

    }

    getRole() {
        return role;
    }
}
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const createMember = async member => {
    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            Item: member,
            ReturnValues: "NONE"
        };
        return await dynamoClient.put(params).promise();
    } catch (e) {
        return e;
    }
}

const deleteMember = async member => {
    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            Key: {
                'memberUuid': member.memberUuid,
                //    'email': member.email
            }
        };
        return await dynamoClient.delete(params).promise();
    } catch (e) {
        return e;
    }
}

const friendRequest = async (memberUuid, key, value) => {

    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            Key: {
                'memberUuid': memberUuid
            },
            UpdateExpression: "SET  #key = list_append(if_not_exists(#key, :empty_list),:value)",
            ExpressionAttributeNames: {
                "#key": key
            },
            ExpressionAttributeValues: {
                ":value": [value],
                ':empty_list': []
            },
            ReturnValues: 'UPDATED_NEW'
        };
        return await dynamoClient.update(params).promise();
    } catch (e) {
        return e;
    }
}

const updateMemberValue = async (memberUuid, key, value) => {

    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            Key: {
                'memberUuid': memberUuid
            },
            UpdateExpression: "set #key = :value",
            ExpressionAttributeNames: {
                "#key": key
            },
            ExpressionAttributeValues: {
                ":value": value
            },
            ReturnValues: 'ALL_NEW'
        };
        return await dynamoClient.update(params).promise();
    } catch (e) {
        return e;
    }
}

const getMemberByMemberUuid = async memberUuid => {
    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            KeyConditionExpression: 'memberUuid = :memberUuid',
            ExpressionAttributeValues: {
                ':memberUuid': memberUuid
            }
        };
        let member = await dynamoClient.query(params).promise();
        return member;
    } catch (e) {
        return e;
    }
}

const getMemberPublicInfoByMemberUuid = async memberUuid => {
    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            KeyConditionExpression: 'memberUuid = :memberUuid',
            ExpressionAttributeValues: {
                ':memberUuid': memberUuid
            },
            ProjectionExpression: "memberUuid, firstName, lastName, profilePic"
        };
        let member = await dynamoClient.query(params).promise();
        return member;
    } catch (e) {
        return e;
    }
}

const getMemberByFullname = async (fullName) => {
    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            IndexName: "fullName-index",
            KeyConditionExpression: 'fullName = :fullName',
            ExpressionAttributeValues: {
                ':fullName': fullName
            },
            ProjectionExpression: "memberUuid, firstName, lastName, profilePic"
        };
        let member = await dynamoClient.query(params).promise();
        return member;
    } catch (e) {
        return e;
    }
}

const getMemberByFirstName = async (firstName) => {
    try {
        let params = {
            TableName: process.env.MEMBER || 'MEMBER',
            IndexName: "firstName-index",
            KeyConditionExpression: 'firstName = :firstName',
            ExpressionAttributeValues: {
                ':firstName': firstName
            },
            ProjectionExpression: "memberUuid, firstName, lastName, profilePic"
        };
        let member = await dynamoClient.query(params).promise();
        return member;
    } catch (e) {
        return e;
    }
}


module.exports = {
    createMember,
    getMemberByMemberUuid,
    deleteMember,
    updateMemberValue,
    getMemberByFullname,
    getMemberByFirstName,
    friendRequest,
    getMemberPublicInfoByMemberUuid
}

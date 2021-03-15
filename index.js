const gamedig = require('gamedig');

const requiredQueryParams = ['type', 'host'];

exports.lambdaHandler = async (event) => {
    let response = {
        headers: { 'Content-Type': 'application/json' }
    };

    try {
        if (!event.queryStringParameters || !requiredQueryParams.every(param => param in event.queryStringParameters)){
            response.statusCode = 422;
            throw new Error('Type or host parameter not specified');
        }
        
        const result = await gamedig.query({
            type: event.queryStringParameters.type,
            host: event.queryStringParameters.host,
            port: event.queryStringParameters?.port,
            maxAttempts: 1,
            socketTimeout: 500,
            givenPortOnly: true
        });
        
        response.statusCode = 200;
        response.body = JSON.stringify(result);
    } catch (e) {
        console.log(e);
        response.statusCode = 500;
        response.body = JSON.stringify({errors: [e.message]});
    }

    return response;
};
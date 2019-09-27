'use strict'
const request = require('request-promise');
let data;

exports.handler = async(event, context) => {
  if(!event.pathParameters || !event.pathParameters.username || !event.pathParameters.password
    || !event.pathParameters.reponame || !event.pathParameters.repodescription) {
      return { statusCode: 403,
        body: JSON.stringify({ message: 'Some of required inputs are missed' })} 
    }  
  let credentialsBase64 = Buffer.from(event.pathParameters.username + ":" + event.pathParameters.password).toString('base64')
    let optionsPost = {
      method: 'POST',
      uri: 'https://api.github.com/user/repos',
      json: true,
      body: {
        'name': event.pathParameters.reponame,
        'description': event.pathParameters.repodescription
      },
      headers: {
        accept: 'application/json',
        'User-Agent': '*',
        "Authorization": "Basic " + credentialsBase64
      }
    };
    try{
    data = await request(optionsPost).then( (res) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'new repo created' })
      };
    });
    return data;
  } catch(err) {
    if(err.statusCode == 422) {
      return { statusCode: 422,
        body: JSON.stringify({ message: 'Repository already exists' })}
    } else  if(err.statusCode == 401) {
      return { statusCode: 401,
        body: JSON.stringify({ message: 'Bad credentials' })}
    } else {
      throw err;
    }
  }
}

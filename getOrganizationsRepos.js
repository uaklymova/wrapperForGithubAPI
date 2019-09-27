'use strict'
const request = require('request-promise');
let data;
/* Fetches all repos from 1st page (max amount is 100)
*/
exports.handler = async (event, context) => {
  if(!event.pathParameters || !event.pathParameters.userid) {
    return { statusCode: 403,
      body: JSON.stringify({ message: 'Some of required inputs are missed' })} 
  }  
  let config = {
    api_url: 'https://api.github.com',
  };

  let optionsGet = {
    method: 'GET',
    uri: config.api_url + '/orgs/' + event.pathParameters.userid + '/repos?page=1&per_page=100',
    headers: {
      accept: 'application/json',
      "User-Agent": "*",
    }
  };
  try {
    data = await request(optionsGet).then((repoArray) => {
      let parsedResponse = JSON.parse(repoArray);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: parsedResponse.length
        })
      };
    });

    return data;
  } catch (err) {
    if (err.statusCode == 404) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Organization with such name is not found'
        })
      }
    } else {
      throw err;
    }
  }
}

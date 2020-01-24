const request = require('request');
const fs = require('fs');
const auth = require('./keys');

let boardId = 341;
const options = {
   method: 'GET',
   url: `https://ifitdev.atlassian.net/rest/agile/1.0/board/${boardId}/issue?maxResults=1000`,
   auth: { username: auth.USER, password: auth.AUTH_KEY },
   headers: {
      'Accept': 'application/json'
   }
};

request(options, function (error, response, body) {
   if (error) throw new Error(error);
   let result = JSON.parse(body);
   let done = false;
   let tickets = getTickets(result['issues'], 'Tier 3');
   createCSV(tickets);
});

function getTickets(issues, status) {
   let tickets = [];
   let done = false;
   issues.forEach(issue => {
      if(issue['fields']['status']['name'] === status) {
         tickets.push({
            key: issue['key']
         });
      }
   });
   return tickets;
}

function createCSV(tickets) {
   let csv = 'Ticket #, Tested By, Pass/Fail, Comments\n';
   tickets.forEach(ticket => {
      csv += `${ticket.key},,,\n`;
   });
   fs.writeFile('tickets.csv', csv, (err) =>{
      if(err) {
         return console.log(err);
      }
      console.log('file saved');
   })
}
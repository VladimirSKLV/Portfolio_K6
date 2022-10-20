import http from 'k6/http';
import { check } from 'k6';


export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 700 },
    { duration: '5m', target: 700 },
    { duration: '10m', target: 0 },
  ],
};
const urlAuth = `https://me3.weawer.ru:8443/auth`;
const username = '********';
const password = '********';
const urlStore = `https://me3.weawer.ru:8443/stores`;
const urlAutocreate = `https://me3.weawer.ru:8443/merchants/autocreate`;
const urlMe = `https://me3.weawer.ru:8443/merchants/me`;



export default function() {

    //Authorization
    const res = http.post(urlAuth, JSON.stringify({
        "keepLoggedIn": true,
        "password": password,
        "username": username
      }),
        { headers: { 
          'Content-Type': 'application/json' 
        }
      });
      //checking that the answer is 200
      check(res, {
             'status auth': (r) => r.status === 200,
          });

    //We start sending requests to 3 different links in parallel using the method GET
    //We can also usisng POST, but instead of null we substitute the body
    const responses = http.batch([
        ['GET', urlStore, null,
        { headers: {
        'X-Auth-Token': res.json().token
        }}],
        ['GET', urlAutocreate, null,
        { headers: {
        'X-Auth-Token': res.json().token
        }}],
        ['GET', urlMe, null,
        { headers: {
        'X-Auth-Token': res.json().token
        }}],
    ]);
    check(responses[2], {
        'all status': (r) => {
            return r.status === 200;
        },
    })
}
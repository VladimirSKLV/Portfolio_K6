import http from 'k6/http';
import { check } from 'k6';

//вызываем резкую нагрузку на сервер
export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1500 }, 
    { duration: '3m', target: 1500 }, 
    { duration: '10s', target: 100 }, 
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};
const urlAuth = `https://me3.weawer.ru:8443/auth`;
const username = '********';
const password = '********';
const urlStore = `https://me3.weawer.ru:8443/stores`;
const urlAutocreate = `https://me3.weawer.ru:8443/merchants/autocreate`;
const urlMe = `https://me3.weawer.ru:8443/merchants/me`;


export default function() {

    const res = http.post(urlAuth, JSON.stringify({
        "keepLoggedIn": true,
        "password": password,
        "username": username
      }),
        { headers: { 
          'Content-Type': 'application/json' 
        }
      });
      check(res, {
             'status auth': (r) => r.status === 200,
          });
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
}
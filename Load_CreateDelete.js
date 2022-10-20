import http from 'k6/http';
import { check } from 'k6';

//Credits hidden within security
const username = '********';
const password = '********';

export const options = {
  stages: [
    { duration: '1m', target: 500 },
    { duration: '30s', target: 250 },
    {duration: '0', target: 0},
  ],
};

export default function () {
 
  //Authorization
  const urlAuth = `https://me3.weawer.ru:8443/auth`;

  let res = http.post(urlAuth, JSON.stringify({
    "keepLoggedIn": true,
    "password": password,
    "username": username
  }), 
    { headers: { 
      'Content-Type': 'application/json' 
    }
  });
  // Verify response
  check(res, {
    'status  200': (r) => r.status === 200,
    'is correct user': (r) => r.json().username === username,
  });

  const urlStore = `https://me3.weawer.ru:8443/stores`;

  let res1 = http.get(urlStore, 
    { headers: {
      'X-Auth-Token': res.json().token
    }}
    );
    check(res1, {
    'status   200': (r) => r.status === 200,
  });

  //CREATE
  const urlLoyalty = `https://me3.weawer.ru:8443/loyalty-programs`

  let programm_id = Math.round(Math.random()*1000000);

  let res2 = http.post(urlLoyalty, JSON.stringify({
    "id": programm_id,
    "campaignId": null,
    "name": "12345",
    "type": "DISCOUNT",
    "prioritized": false,
    "description": "12345",
    "storeIds": [],
    "bankNames": [],
    "daysOfWeek": [
        "TUESDAY",
        "SATURDAY",
        "MONDAY",
        "WEDNESDAY",
        "SUNDAY",
        "FRIDAY",
        "THURSDAY"
    ],
    "startsAt": null,
    "finishesAt": null,
    "finishesOn": 1664312400000,
    "massLoyaltyPct": 5.0,
    "massAffluentLoyaltyPct": 5.0,
    "affluentLoyaltyPct": 5.0,
    "fpPct": 0.0,
    "qr": true,
    "selfieToPay": true,
    "visa": true,
    "mastercard": true,
    "mir": true,
    "product": "",
    "productCategory": null,
    "awardProductCategory": null,
    "cboRequiredCount": 0,
    "loyaltyCardPct": 0.0,
    "loyaltyCardFpPct": 0.0,
    "fullDescription": "",
    "favorites": [],
    "loyaltyLimitPerDay": 0,
    "loyaltyExpiresAt": null,
    "status": "ACTIVE",
    "standardFlow": true,
    "preOrderFlow": false,
    "purchasesCount": 0,
    "firstPurchases": false,
    "npWholeOrder": true,
    "createdAt": 1664264114357,
    "updatedAt": 1664264114357,
    "cboIconType": "SMILEY",
    "tags": [
        "STANDARD_DISCOUNT_PROGRAM"
    ],
    "oneTimeLoyaltyThreshold": 0,
    "budget": null,
    "comboProductCategories": [],
    "loyaltyLimitPerMonth": 0,
    "bannerIcon": "BANNER_IMAGE_EMPTY",
    "productCategoryIcons": []
  }
  ),
  { headers: {
    'X-Auth-Token': res.json().token,
    'Content-Type': 'application/json;charset=UTF-8'
  }})
  check(res2, {
    'status is 200': (r) => r.status === 200,
  });
  
  //DELETE
  let res3 = http.del(urlLoyalty + '/' + res2.json().id, null,
  { headers: {
    'X-Auth-Token': res.json().token,
    'Content-Type': 'application/json'
  }});
  check(res3, {
    'status 200': (r) => r.status === 200,
  });
}



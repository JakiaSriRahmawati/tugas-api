import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 15, 
    duration: '75s', 
};

const BASE_URL = 'http://127.0.0.1:8000/api';

export default function () {
    
    let registerPayload = JSON.stringify({
        name: `zakiaya${__VU}`, 
        email: `zakiaya${__VU}@gmail.com`, 
        password: "zakiaya123",
        password_confirmation: "zakiaya123",
    });
    
    let registerRes = http.post(`${BASE_URL}/register`, registerPayload, {
        headers: { 
            'Content-Type': 'application/json' 
        },
    });

    check(registerRes, {
        'register response status is 201': (r) => r.status === 201,
    });

    let loginPayload = JSON.stringify({
        email: `zakiaya${__VU}@gmail.com`, 
        password: "zakiaya123",
    });
    
    let loginRes = http.post(`${BASE_URL}/login`, loginPayload, {
        headers: { 
            'Content-Type': 'application/json'
        },
    });

    check(loginRes, {
        'login response status is 200': (r) => r.status === 200,
    });

    let token = loginRes.json().token; 
    for (let i = 1; i <= 3; i++) {

        let productPayload = JSON.stringify({
            name: `sepatu super ${i} by zakiaya ${__VU}`, 
            price: 20000 + (i * 20000), 
        });

        let productRes = http.post(`${BASE_URL}/products`, productPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        check(productRes, {
            'create product response status is 201': (r) => r.status === 201,
        });
    }

    // Get Products
    // let getProductsRes = http.get(`${BASE_URL}/products`, {
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //     },
    // });

    // check(getProductsRes, {
    //     'get products response status is 200': (r) => r.status === 200,
    // });

    sleep(1); 
}

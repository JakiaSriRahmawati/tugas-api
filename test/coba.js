import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter, Trend } from 'k6/metrics';


const registerResponseTime = new Trend('register_response_time');
const loginResponseTime = new Trend('login_response_time');
const createProductResponseTime = new Trend('create_product_response_time');

const registerSuccessRate = new Rate('register_success_rate');
const loginSuccessRate = new Rate('login_success_rate');
const createProductSuccessRate = new Rate('create_product_success_rate');

const productsCreated = new Counter('products_created');

export const options = {
    scenarios: {
        my_scenario: {
            executor: 'constant-vus', 
            vus: 19,                 
            duration: '1m',         
            gracefulStop: '20s',    
        },
    },
    thresholds: {
        'http_req_duration{type:create_product}': ['p(95)<35000'],
        'http_req_duration{type:login}': ['p(95)<30000'],
        'http_req_duration{type:register}': ['p(95)<20000'],
        
        'register_success_rate': ['rate>0.95'],   
        'login_success_rate': ['rate>0.95'],       
        'create_product_success_rate': ['rate>0.95'], 

        'http_req_failed': ['rate<0.01'], 
    },
};

const BASE_URL = 'http://127.0.0.1:8000/api';

export default function () {
    const userId = __VU;  
    const uniqueTimestamp = Math.floor(Date.now() / 1000); 

    const registerPayload = JSON.stringify({
        name: `dina${userId}`,
        email: `dina${userId}_${uniqueTimestamp}@gmail.com`, 
        password: "87654321",
        password_confirmation: "87654321",
    });

    const registerRes = http.post(`${BASE_URL}/register`, registerPayload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: '60s',
    });

    registerResponseTime.add(registerRes.timings.duration);

    const registerSuccess = check(registerRes, {
        'register response status is 201': (r) => r.status === 201,
    });
    registerSuccessRate.add(registerSuccess);

    if (!registerSuccess) {
        console.log(`Register failed for VU ${userId}: ${registerRes.status} - ${registerRes.body}`);
        return;  
    }

    const loginPayload = JSON.stringify({
        email: `dina${userId}_${uniqueTimestamp}@gmail.com`, 
        password: "87654321",
    });

    const loginRes = http.post(`${BASE_URL}/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: '60s',
    });

    loginResponseTime.add(loginRes.timings.duration);

    const loginSuccess = check(loginRes, {
        'login response status is 200': (r) => r.status === 200,
    });
    loginSuccessRate.add(loginSuccess);

    if (!loginSuccess) {
        console.log(`Login failed for VU ${userId}: ${loginRes.status} - ${loginRes.body}`);
        return; 
    }

    const token = loginRes.json('token');
    if (!token) {
        console.log(`Token not received for VU ${userId}`);
        return; 
    }

    for (let i = 1; i <= 3; i++) {
        const productPayload = JSON.stringify({
            name: `tisu ${i} by dina ${userId}`,
            price: 10000 + (i * 10000),
        });

        const productRes = http.post(`${BASE_URL}/products`, productPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            timeout: '350s',
        });

        createProductResponseTime.add(productRes.timings.duration);

        const productSuccess = check(productRes, {
            'create product response status is 201': (r) => r.status === 201,
        });
        createProductSuccessRate.add(productSuccess);

        if (productSuccess) {
            productsCreated.add(1);
        } else {
            console.log(`Create product failed for VU ${userId}, product ${i}: ${productRes.status} - ${productRes.body}`);
        }
    }
    sleep(1);
}

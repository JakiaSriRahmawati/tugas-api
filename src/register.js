import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,          
  duration: '10s',  
};

export default function() {
  const uniqueId = new Date().getTime();  
  const body = {
    name: 'ilal',
    email: `ilal-${uniqueId}@gmail.com`, 
    password: 'ilalilal',
    password_confirmation: 'ilalilal',
  };

  // Mengirimkan POST request untuk mendaftarkan pengguna
  const response = http.post('http://localhost:8000/api/users', JSON.stringify(body), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  check(response, {
    'register response status is 201': (r) => r.status === 201,
  });

 
  sleep(1);
}

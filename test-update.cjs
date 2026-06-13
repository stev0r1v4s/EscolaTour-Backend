const http = require('http');

const loginData = JSON.stringify({
  username: 'admin',
  password: 'adminpassword'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Login response:', res.statusCode, data);
    try {
      const token = JSON.parse(data).token;
      if (!token) return console.log('No token obtained');

      const updateData = JSON.stringify({
        fullName: 'Test User Name',
        email: 'admin@escolatour.com',
        phone: '1234567890',
        city: 'Bogota'
      });

      const updateOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users/me/profile',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Length': Buffer.byteLength(updateData)
        }
      };

      const updateReq = http.request(updateOptions, (updateRes) => {
        let uData = '';
        updateRes.on('data', chunk => uData += chunk);
        updateRes.on('end', () => {
          console.log('Update response:', updateRes.statusCode, uData);
        });
      });
      updateReq.write(updateData);
      updateReq.end();

    } catch (err) {
      console.log('Error parsing login response', err);
    }
  });
});

loginReq.write(loginData);
loginReq.end();

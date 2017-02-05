module.exports = {
  weather: {
    freq: 1000 * 60 * 10,
    api_key: '9bea99ed70d74daf9de95646161212',
    api_url: 'http://api.apixu.com/v1/forecast.json'
  },
  server: {
    port: 3000
  },
  lights: {
    base: 'http://192.168.1.205',
    user: '94GXkPkjKdmHgIK9aibxrdYHxsPA4qndzZaBVnuc',
    poll: 3000
  },
  outlets: {
    poll: 3000,
    outlets: ['192.168.1.220']
  },
  home: {
    db: './svr/home.data'
  }
};

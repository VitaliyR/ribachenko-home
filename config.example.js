module.exports = {
  weather: {
    freq: 1000 * 60 * 10,
    api_key: '',
    api_url: 'http://api.apixu.com/v1/forecast.json'
  },
  server: {
    port: 3000
  },
  lights: {
    base: 'http://192.168.1.205',
    user: '',
    poll: 3000
  },
  outlets: {
    poll: 3000,
    outlets: ['192.168.1.220'],
    dumb: true
  },
  home: {
    db: './svr/home.data'
  }
};

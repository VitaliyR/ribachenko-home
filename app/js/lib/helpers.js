var moment = require('moment');

Handlebars.registerHelper('moment', function(date, format) {
  date = moment.isMoment(date) ? date : moment(date);
  return new Handlebars.SafeString(date.format(format));
});

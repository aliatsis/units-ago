var capitalize = require('capitalize');
var moment = require('moment');

module.exports = {
  get: get,
  parse: parse
};

function get(unitMap, startOfUnit) {
  return moment().subtract(moment.duration(unitMap)).startOf(startOfUnit);
}

function parse(date, baseUnit, startDate) {
  date = moment(new Date(date || Date.now()));

  return [
    'years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'
  ].reduce(function(result, unit) {
    result[unit] = moment(startDate || Date.now()).diff(date, unit, true);

    if (baseUnit && unit !== baseUnit) {
      var asUnitFn = 'as' + capitalize(unit);
      var asBaseUnitFn = 'as' + capitalize(baseUnit);
      var duration = moment.duration(result[unit], unit);
      var anchored = duration[asBaseUnitFn]();
      var remainder = anchored - Math.floor(anchored);

      result[unit] = moment.duration(remainder, baseUnit)[asUnitFn]();
    }

    result[unit] = Math.floor(result[unit]);

    return result;
  }, {});
}
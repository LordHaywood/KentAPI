var fs = require('fs');

var readJson = (path, cb) => {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function getYearCalander(year, program) {

  const kentCalander = readJson('./calanderData.json');
  let cal = kentCalander[year];
  let endDate = new Date(cal.yearDates.end).getTime();
  let dateCalander = {};
  let weekNo = 0;
  for (let currentDate = new Date(cal.yearDates.start).getTime(); currentDate<=endDate - 1000 * 60 * 60 * 24 * 7; currentDate += 1000 * 60 * 60 * 24 * 7) {
    let dateStr = new Date(currentDate).toISOString().slice(0, 10);
    if (dateStr > cal.autumnTerm.end && dateStr < cal.springTerm.start) {
      dateCalander[dateStr] = "C" + Math.floor((currentDate - new Date( cal.autumnTerm.end).getTime()) / (1000 * 60 * 60 * 24 * 7) + 1);
    } else if (dateStr > cal.springTerm.end && dateStr < cal.summerTerm.start) {
      dateCalander[dateStr] = "E" + Math.floor((currentDate - new Date( cal.springTerm.end).getTime()) / (1000 * 60 * 60 * 24 * 7) + 1);
    } else if (program != 'PG' && dateStr > cal.summerTerm.end) {
      dateCalander[dateStr] = "S" + Math.floor((currentDate - new Date( cal.summerTerm.end).getTime()) / (1000 * 60 * 60 * 24 * 7) + 1);
    } else {
      dateCalander[dateStr] = weekNo.toString();
      weekNo++;
    }
  }
  return dateCalander;
}

module.exports = {
  getYearCalander
};
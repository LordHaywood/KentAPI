const express = require('express');
const { getYearCalander } = require('./lib');
const fetch = require('node-fetch');

const app = express();
const port = 8080;

const responce = (res, ok, body) => {
  return res.send(JSON.stringify({ok, ...body, timestamp: new Date().getTime()}));
}


app.get('/calander', (req, res) => {
  const year = req.query.year;
  const program = req.query.program;
  const validYears = ['2016-2017', '2017-2018', '2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];
  const validPrograms = ['PG', 'UG'];

  if (validYears.indexOf(year) == -1) {
    return responce(res, false, {message: 'Invalid year'});
  }
  if (validPrograms.indexOf(program) == -1) {
    return responce(res, false, {message: 'Invalid program'});
  }
  const calander = getYearCalander(year, program);
  return responce(res, true, {calander});
});

app.get('/freePCs', (req, res) => {
  return fetch('https://api.kent.ac.uk/api/v1/pcs/free')
    .then(response => response.json())
    .then(json => {
      return responce(res, true, {freePCs: json});
    })
    .catch(err => {
      return responce(res, false, {message: err});
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
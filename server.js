const express = require('express')
const app = express()
const port = 3000

const vehicles = [
  'vokswagen',
  'fiat',
  'tesla',
  'ford'
]

const bookings = {};

function createError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

app.use(express.static('dist'))
app.use(express.json());
app.use('/fixtures', express.static('fixtures'))

app.param('vehicle', (req, res, next, id) => {
  next();
})

app.get('/api/v1/bookings/vehicle/:vehicle', (req, res) => {
  res.send(bookings[req.params.vehicle] || {});
})

app.post('/api/v1/bookings/vehicle/:vehicle', (req, res) => {
  const id = req.params.vehicle;
  const date = req.body.date;
  const time = req.body.time;
  const userid = req.body.userid;
  const key = `${date},${time}`;

  if (!bookings[id]) {
    bookings[id] = {}
  }

  if (bookings[id][key]) {
    res.send(createError(409, 'Conflict: Booking already exists'));
    return;
  }

  bookings[id][key] = userid;
  res.send({status: 200});
})

app.listen(port, () => {
  console.log(`DVader's Garage Server listening at http://localhost:${port}/`)
})

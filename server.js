const express = require('express');
const app = express();
const payload = '/dist/apps/light-switch-ui';

app.use(express.static(__dirname + payload));

app.get('*', (req, res) => {
  res.sendFile(payload + '/index.html', { root: __dirname });
});

app.listen(4200, () => {
  console.log('application being served at port ', 4200);
});

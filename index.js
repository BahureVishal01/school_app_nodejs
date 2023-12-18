
const app = require('./app');
const port = process.env.PORT || 8000;


app.listen(port, () => {
  setTimeout(() => {
    console.log(`|=============================================================>> 
    School App Listening on Server ::: ${port}`)
  });
});
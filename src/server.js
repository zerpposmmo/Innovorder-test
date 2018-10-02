const App = require('./app');

const app = (new App()).app;

let server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log(`Server listening at http://${host}:${port}`);
});

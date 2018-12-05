let express = require('express');
let app = express();
let http = require('http').Server(app);
let https = require('https').Server(app);
let path = require('path');
let serveStatic = require('serve-static');
let fs = require('fs');

// serve all files in dist
app.use(express.static('dist'));

app.all('*', function(req, res, next){
    console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
    if (req.secure) {
        return next();
    }

    res.redirect('https://'+req.hostname + ':' + app.get('secPort') + req.url);
});

// serve the index.html as starting page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
});


http.listen(process.env.PORT || 8090, function(){
    console.log(`listening on *: ${http.address().port}`);
});
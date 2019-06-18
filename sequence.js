const express = require('express');
const path = require('path');
const app = express();


// Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'docs','create-sequence-list.html'));
});

app.use('/scripts', express.static(path.join(__dirname, 'docs/scripts')))
app.use('/styles', express.static(path.join(__dirname, 'docs/styles')))



// Port Listen
app.listen(3000);
console.log("Create Sequence now ready...");
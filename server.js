const {SerialPort} = require('serialport');
const {ReadlineParser} = require ('@serialport/parser-readline');

const port = new SerialPort({
    path: '/dev/cu.usbmodem1101',
    baudRate: 9600,
})

const parser = port.pipe(new ReadlineParser({delimiter:'\r\n'}));

let sensorData = "";

parser.on('data', function(data){
    console.log(data);
    sensorData = data;
});

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === "/data"){
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end(sensorData);
        return;
    } 

    fs.readFile('index.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});

server.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});

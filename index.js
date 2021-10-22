const express = require('express');
const app = express();
const port = 3000;

const morgan = require("morgan"); 
const server=require('http').createServer(app);
const io = require('socket.io')(server);
const requestIp = require('request-ip');
const fs = require('fs');
const util = require('util');
const log_file = fs.createWriteStream(__dirname + '/access.log', {flags : 'w'});

const write= (d)=> { //
  log_file.write(util.format(d) + '\n');
};

// app.use(morgan("tiny")); 
app.use(express.static('docs')); 
app.get('/hola', (req, res) => res.send('Hello World!'));
app.get('/log',(req,res)=>{
    const clientIp = requestIp.getClientIp(req);
    console.log('log ok', clientIp);
    res.send('');
})

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        const start=socket.handshake.time;
        const now=new Date();
        write(`${now} --- IP:${socket.handshake.address} --- start: ${start} --- end:${now}`);
    });
  });

server.listen(port, () => console.log(`Listening on port ${port}`));
const net = require('net');
const rsa = require('./rsa.js');
const fs = require('fs');
const keys = rsa.generateKeys(4096);
const publicKey = keys.publicKey;
const privateKey = keys.privateKey;

const server = net.createServer(function(socket) {
  socket.on('data', function(data) {
    //console.log('Server Received: ' + data);
    handleMessage(data, socket);
  });
});

server.listen(3141, '127.0.0.1');
function handleMessage(message, agent) {
  parsedMessage = JSON.parse(message);
  switch (parsedMessage.messageType) {
    case "GET-KEY":
      agent.write(JSON.stringify({
        messageType: "SET-KEY",
        body: publicKey
      }));
      break;
    case "GET-CONTENT":
      var decrypted = rsa.decrypt(privateKey, Buffer.from(parsedMessage.body));
      getContent(JSON.parse(decrypted).url, agent, parsedMessage.clientKey);
      break;
  }
}

function getContent(url, agent, key) {
  var urlSafe = url;
  url.split("..").join("");
  if (urlSafe === "/") {
    urlSafe = "index.cwl"
  }
  fs.readFile("public/" + urlSafe, (err, data) => {
    agent.write(JSON.stringify({
      messageType: "SET-CONTENT",
      body: rsa.encrypt(key, JSON.stringify({
        content: data.toString(),
        url: url
      })),
    }));
  });
}
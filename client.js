const net = require('net');
const rsa = require('./rsa.js');

function generateKeys() {
  const keys = rsa.generateKeys(4096);
  publicKey = keys.publicKey;
  privateKey = keys.privateKey;
}

var keys = generateKeys(); 
setInterval(function () {
  keys = generateKeys();
}, 3600000) // 1 hour key regeneration
const client = new net.Socket();

client.connect(3141, '127.0.0.1', function() {
  console.log('Connected');
  client.write(JSON.stringify({
    messageType: 'GET-KEY'
  }));
});

client.on('data', function(data) {
  //console.log('Client Received: ' + data);
  handleMessage(data);
  //client.destroy();
  //client.write("tank you for beautiful poem of " + data);
});

client.on('close', function() {
  console.log('Connection closed');
});

function handleMessage(data) {
  parsedData = JSON.parse(data);
  switch (parsedData.messageType) {
    case "SET-KEY":
      const serverKey = parsedData.body;
      client.write(JSON.stringify({
        messageType: 'GET-CONTENT',
        body: rsa.encrypt(serverKey, JSON.stringify({
          url: '/',
          other: null,
        })),
        clientKey:publicKey
      }))
      break;
    case "SET-CONTENT":
      const decrypted = rsa.decrypt(privateKey, Buffer.from(parsedData.body));
      console.log(JSON.parse(decrypted).content);
      break;
  }
}
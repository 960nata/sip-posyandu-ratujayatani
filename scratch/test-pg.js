const net = require('net');

const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 6543;

console.log(`Connecting to ${host}:${port}...`);
const client = net.connect({ host, port }, () => {
  console.log('Connected! Sending SSLRequest packet...');
  
  // SSLRequest packet: length 8, protocol 80877103 (0x04d22d2f)
  const buf = Buffer.alloc(8);
  buf.writeInt32BE(8, 0);
  buf.writeInt32BE(80877103, 4);
  
  client.write(buf);
});

client.on('data', (data) => {
  console.log('Received response from server:', data.toString(), 'Bytes:', data);
  client.end();
});

client.on('end', () => {
  console.log('Connection closed by server.');
});

client.on('error', (err) => {
  console.error('Socket error:', err);
});

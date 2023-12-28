import { WebSocket } from 'ws';
import { createInterface } from 'readline';
import { Message } from '../server/models/Message';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function main() {
  const name = process.argv[2];
  const ws = new WebSocket('ws://localhost:8000');

  subscribe();

  function subscribe() {
    ws.on('open', () => {
      sendMessage(name)

      rl.on('line', (input) => {
        sendMessage(input);
      });
    });

    ws.on('message', raw => {
      const message = JSON.parse(raw.toString('utf8'));
      printMessage(message);
    });
  }

  function sendMessage(message: string) {
    ws.send(JSON.stringify({
      text: message
    }));
  }
}

main();

function printMessage(message: Message) {
  console.log(`${timestampTohhmm(message.timestamp)} ${message.from}: ${message.text}`);
}

function timestampTohhmm(timestamp: number): string {
  const date = new Date(timestamp);
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');

  return `${hh}:${mm}`;
}

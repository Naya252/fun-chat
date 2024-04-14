import App from './app';
import ws from './repositories/ws';

const app = new App();

app.init();
ws.handleMessage();

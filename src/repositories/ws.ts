import { callMessages } from '@/services/service';

const BASE_URL = `ws://localhost:4000/`;

class WS {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket(BASE_URL);
  }

  public handleMessage(): void {
    this.ws.onmessage = (e: MessageEvent): void => {
      if (e.data !== null && typeof e.data === 'string') {
        callMessages(e.data);
      }
    };
  }

  public handleError(): void {
    this.ws.onerror = (e: Event): void => {
      console.log('ERROR', e);
    };
  }

  public send(data: string): void {
    this.ws.send(data);
  }
}

const ws = new WS();
export default ws;

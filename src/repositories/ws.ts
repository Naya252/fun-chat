import { callMessages, openedWs, closedWs } from '@/services/service';

const BASE_URL = `ws://localhost:4000/`;

class WS {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket(BASE_URL);
    this.handleEvents();
  }

  public handleMessage(): void {
    this.ws.onmessage = (e: MessageEvent): void => {
      if (e.data !== null && typeof e.data === 'string') {
        callMessages(e.data);
      }
    };
  }

  public handleOpen(): void {
    this.ws.onopen = (): void => {
      this.handleEvents();
      openedWs();
    };
  }

  public handleClose(): void {
    this.ws.onclose = (): void => {
      closedWs();
      this.ws = new WebSocket(BASE_URL);
      this.handleEvents();
    };
  }

  public handleError(): void {
    this.ws.onerror = (): void => {
      // console.log('ERROR', e);
    };
  }

  public send(data: string): void {
    this.ws.send(data);
  }

  public close(): void {
    this.ws.close();
  }

  public handleEvents(): void {
    this.handleMessage();
    this.handleOpen();
    this.handleClose();
    this.handleError();
  }
}

const ws = new WS();
export default ws;

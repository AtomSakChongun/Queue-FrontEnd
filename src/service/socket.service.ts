import { Injectable, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: WebSocket;
  private queueSubject = new Subject<string>();
  private isBrowser: boolean;
  private currentClientId: string = '01';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.connect();
    }
  }

  updateClientId(id: string) {
    this.currentClientId = id;
  }

  private connect() {
    this.ngZone.runOutsideAngular(() => {
      this.socket = new WebSocket('ws://localhost:3000/ws');

      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WS received:', data);
          if (data.queue !== undefined && data.queue !== null) {
            this.ngZone.run(() => {
              this.queueSubject.next(String(data.queue));
            });
          }
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed, reconnecting in 3s...');
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => this.connect(), 3000);
        });
      };
    });
  }

  sendAction(action: 'reset' | 'take') {
    if (!this.isBrowser) return;

    const payload = { client_id: this.currentClientId, action };

    const send = () => {
      this.socket.send(JSON.stringify(payload));
      console.log('Sent:', payload);
    };

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      const retry = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          clearInterval(retry);
          send();
        }
      }, 100);
      setTimeout(() => clearInterval(retry), 5000);
      return;
    }

    send();
  }

  getQueueUpdates(): Observable<string> {
    return this.queueSubject.asObservable();
  }
}

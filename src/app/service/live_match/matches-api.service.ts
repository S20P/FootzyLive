import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchesApiService {

  private url_live = "https://api.footzyscore.com";

  private socket;

  constructor() {
    var connection = {
      "force new connection": true,
      "reconnectionAttempts": "Infinity",
      "timeout": 10000,
      "transports": ["websocket"]
    };


    this.socket = io.connect(this.url_live, connection, {
      transports: ['xhr-polling']
    });

    console.log("socket", this.socket);
    this.socket.on("response", (data) => {
      // console.log('TodoAdded: '+JSON.stringify(data));
    });
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });
    });
  }

  public sendMessage(message) {
    return this.socket.emit('SendSocketData', message);
  }

  public liveMatches() {
    return Observable.create((observer) => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });
    });

  }
}

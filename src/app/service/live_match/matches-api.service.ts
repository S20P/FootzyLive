import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
//declare var io: any;


@Injectable()
export class MatchesApiService {

  private url_live = "https://api.footzyscore.com:8080";

  //private url_live = "http://206.189.173.79:8080";

  private socket;

  constructor() {

    var connection = {
      "force new connection": true,
      "reconnectionAttempts": "Infinity",
      "timeout": 10000,
      "transports": ["websocket", "polling"],
      "reconnect": true,
      'pingInterval': 40000,
      'pingTimeout': 25000,
      'check_origin': false
    };


    // this.socket = io.connect(this.url_live, connection, {
    //   secure: true
    // });

    // this.socket = io.connect('ws://api.footzyscore.com', connection,
    //   {
    //     "transports": ['websocket', 'polling'],
    //     "secure": true,
    //     "reconnect": true
    //   });

    this.socket = io.connect('https://api.footzyscore.com', {
      secure: true,
      transports: ['xhr-polling']
    });
    console.log(this.socket);



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

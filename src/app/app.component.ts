import {
    Component,
    OnInit,
    EventEmitter,
    Output
} from '@angular/core';

import { PushNotificationService } from './service/push-notification/push-notification.service';
import { MessagingService } from './service/firebase/messaging.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from "firebase";



// declare var firebase: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})


export class AppComponent {
    title1 = 'app';
    loading;
    albums;
    items;
    message;

    title = 'app works!';
    user;





    constructor(
        private _notificationService: PushNotificationService,
        private msgService: MessagingService
    ) {
        localStorage.removeItem('firebase:previous_websocket_failure');
        this.loading = "none";
        this._notificationService.requestPermission();
    }

    ngOnInit() {

        this.msgService.getPermission();
        // let msg = this.msgService.receiveMessage();
        //  console.log("msg is...*", msg);

        this.msgService.currentMessage.subscribe(data => {
            console.log("message-resis", data);
            if (data !== null) {
                this.message = data['data'];
                console.log("message is...*", this.message);
                console.log("body", this.message.body);
                let datamsg: Array<any> = [];
                datamsg.push({
                    'title': this.message.title,
                    'alertContent': this.message.body,
                    'click_action': this.message.click_action,
                    'action_id': this.message.action_id
                });
                this._notificationService.generateNotification(datamsg);
            }













            // let notify = this.message['notification'];
            // console.log("notify",notify);
            // let data: Array<any> = [];
            // data.push({
            //     'title': notify.title,
            //     'alertContent': notify.body
            // });
            // this._notificationService.generateNotification(data);
        });


        let data = this.msgService.Subscribe_topic();
        console.log("mess-dd", data);

        // let message = this.msgService.currentMessage;
        // console.log("mess",message);

        //  this.notify();

        // var permission = Notification['permission'];

        // console.log("permission",permission);
        // if ("Notification" in window) {
        //     var permission = Notification['permission'];
        //     console.log("permission", permission);
        //     if (permission === "denied") {
        //         console.log("permition is denied");
        //         return;
        //     } else if (permission === "granted") {
        //         console.log("permition is granted");
        //         //  this.notify();
        //     }
        // }


        // if ("Notification" in window) {
        //   var permission = Notification['permission'];

        //   if (permission === "denied") { 
        //     console.log("permition is denied");
        //     return;
        //   } else if (permission === "granted") { 
        //    console.log("permition is granted");
        //     return checkVersion();
        //   }

        //   Notification.requestPermission().then(function() {
        //     checkVersion();
        //   });
        // }

        // function checkVersion() {

        //   var latestVersion = document.querySelector(".js-currentVersion").textContent;
        //   var currentVersion = localStorage.getItem("conciseVersion");
        //   if (currentVersion === null || semverCompare(currentVersion, latestVersion) === -1 ) {      
        //     displayNotification(
        //       `Click to see what's new in v${latestVersion}`,
        //       "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/concise-logo.png",
        //       "A new version of Concise is available",
        //       `https://github.com/ConciseCSS/concise.css/releases/v${latestVersion}`,
        //       4000
        //     );

        //     localStorage.setItem("conciseVersion", latestVersion);
        //   }
        // }

        // function displayNotification(body, icon, title, link, duration) {
        //   link = link || 0; 
        //   duration = duration || 5000; 

        //   var options = {
        //     body: body,
        //     icon: icon
        //   };

        //   var n = new Notification(title, options);

        //   if (link) {
        //     n.onclick = function () {
        //       window.open(link);
        //     };
        //   }

        //   setTimeout(n.close.bind(n), duration);
        // }

        // Web Notification end




    }





    notify() {
        let data: Array<any> = [];
        data.push({
            'title': 'Approval',
            'alertContent': 'This is First Alert -- By Debasis Saha'
        });
        data.push({
            'title': 'Request',
            'alertContent': 'This is Second Alert -- By Debasis Saha'
        });
        data.push({
            'title': 'Leave Application',
            'alertContent': 'This is Third Alert -- By Debasis Saha'
        });
        data.push({
            'title': 'Approval',
            'alertContent': 'This is Fourth Alert -- By Debasis Saha'
        });
        data.push({
            'title': 'To Do Task',
            'alertContent': 'This is Fifth Alert -- By Debasis Saha'
        });
        this._notificationService.generateNotification(data);
    }







}

import { Component, OnInit } from '@angular/core';
import { Nanium } from 'nanium/core';
import { NaniumConsumerBrowserHttp } from 'nanium/managers/consumers/browserHttp';
import { EventSubscriptionSendInterceptorService } from './event-subscription-interceptor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    // init nanium
    await Nanium.addManager(new NaniumConsumerBrowserHttp({
      apiUrl: 'http://localhost:3000/api',
      apiEventUrl: 'http://localhost:3000/events',
      eventSubscriptionSendInterceptors: [EventSubscriptionSendInterceptorService]
    }));
  }
}

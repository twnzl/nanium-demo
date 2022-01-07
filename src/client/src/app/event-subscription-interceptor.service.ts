import { Injectable } from '@angular/core';
import { EventSubscriptionSendInterceptor } from 'nanium/interfaces/eventSubscriptionInterceptor';
import { DemoSubscriptionData } from '../../../server/events/subscriptionData';
import { EventSubscription } from '../../../../../nanium/interfaces/eventSubscription';

@Injectable({
  providedIn: 'root'
})
export class EventSubscriptionSendInterceptorService implements EventSubscriptionSendInterceptor<any, DemoSubscriptionData> {

  async execute(eventClass: { new(data?: any): any }, subscription: EventSubscription<DemoSubscriptionData>): Promise<void> {
    subscription.additionalData = {
      token: '1234',
      tenant: 'Company1'
    }
  }
}

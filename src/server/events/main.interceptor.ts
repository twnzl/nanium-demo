import {
	EventEmissionSendInterceptor,
	EventSubscriptionReceiveInterceptor
} from 'nanium/interfaces/eventSubscriptionInterceptor';
import { EventBase } from './eventBase';
import { DemoSubscriptionData } from './subscriptionData';
import { ServiceRequestContext } from '../services/serviceRequestContext';
import { EventSubscription } from '../../../../nanium/interfaces/eventSubscription';

export class DemoEventSubscriptionReceiveInterceptor implements EventSubscriptionReceiveInterceptor<EventBase> {
	async execute(data: EventSubscription<DemoSubscriptionData>): Promise<void> {
		if (data.additionalData?.token === '1234') {
			if (data.additionalData.tenant !== 'Company1') {
				throw new Error("unauthorized");
			}
		} else if (data.additionalData?.token === '5678') {
			if (data.additionalData.tenant !== 'Company2') {
				throw new Error("unauthorized");
			}
		} else {
			throw new Error("unauthorized");
		}
	}
}

export class DemoEventEmissionSendInterceptor implements EventEmissionSendInterceptor<EventBase> {
	async execute(event: EventBase, context: ServiceRequestContext, subscription: EventSubscription<DemoSubscriptionData>): Promise<boolean> {
		// basic permissions have been checked in DemoEventSubscriptionReceiveInterceptor.
		// So it is ensured that every existing subscriber has basic permissions for this event
		// but here e.g. you can make differences regarding the specific event

		return true;
	}
}

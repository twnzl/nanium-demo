import { Nanium } from 'nanium/core';
import { EventHandler } from 'nanium/interfaces/eventHandler';
import { ExecutionContext } from 'nanium/interfaces/executionContext';
import { EventSubscription } from '../../../../nanium/interfaces/eventSubscription';
import { NaniumObject } from 'nanium/objects';

export class EventBase<T> extends NaniumObject<T> {

	emit(context?: ExecutionContext): void {
		Nanium.emit(this, undefined, context);
	}

	static async subscribe(handler: EventHandler): Promise<EventSubscription> {
		return await Nanium.subscribe(this, handler);
	}

	static async unsubscribe(subscription: EventSubscription): Promise<void> {
		await Nanium.unsubscribe(subscription);
	}
}

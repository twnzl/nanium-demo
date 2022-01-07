import { ServiceExecutor } from 'nanium/interfaces/serviceExecutor';
import { HeroesAddRequest } from './add.contract';
import { ServiceRequestContext } from '../serviceRequestContext';
import { Database } from '../../database';
import { HeroesCreatedEvent } from '../../events/heroes/created.event';

export class HeroesAddExecutor implements ServiceExecutor<HeroesAddRequest, void> {
	static serviceName: string = 'NaniumDemo:heroes/add';

	async execute(request: HeroesAddRequest, executionContext: ServiceRequestContext): Promise<void> {
		request.body.id = Math.max(...Database.Heroes.map(h => (h.id ?? 0))) + 1;
		Database.Heroes.push(request.body);
		new HeroesCreatedEvent(request.body).emit(executionContext);
	}
}

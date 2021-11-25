import { ServiceExecutor } from 'nanium/interfaces/serviceExecutor';
import { HeroesQueryRequest } from './query.contract';
import { ServiceRequestContext } from '../serviceRequestContext';
import { Hero } from './heroes.contractpart';
import { Database } from '../../database';

export class HeroesQueryExecutor implements ServiceExecutor<HeroesQueryRequest, Hero[]> {
	static serviceName: string = 'NaniumDemo:heroes/query';

	async execute(request: HeroesQueryRequest, executionContext: ServiceRequestContext): Promise<Hero[]> {
		let result: Hero[] = Database.Heroes;
		if (request.body.id) {
			result = result.filter(h => h.id === request.body.id);
		}
		if (request.body.name) {
			result = result.filter(h => h.name?.toLowerCase().includes((request.body.name ?? '').toLowerCase()));
		}
		if (request.body.skills?.length) {
			result = result.filter(h => request.body.skills?.every(s => h.skills?.includes(s)));
		}
		return result;
	}
}

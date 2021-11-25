import { ServiceRequestBase } from '../serviceRequestBase';
import { RequestType } from 'nanium/serializers/core';
import { Hero, HeroSkill } from './heroes.contractpart';

export class HeroesQueryRequestBody {
	id?: number;
	name?: string;
	skills?: HeroSkill[];
	olderThan?: number;
}

@RequestType({
	responseType: Hero,
	genericTypes: { TRequestBody: HeroesQueryRequestBody },
	scope: 'public'
})
export class HeroesQueryRequest extends ServiceRequestBase<HeroesQueryRequestBody, Hero[]> {
	static serviceName: string = 'NaniumDemo:heroes/query';
}

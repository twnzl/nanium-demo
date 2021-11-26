import { ServiceRequestBase } from '../serviceRequestBase';
import { ArrayType, RequestType, Type } from 'nanium/serializers/core';
import { Hero, HeroSkill } from './heroes.contractpart';

export class HeroesQueryRequestBody {
	@Type(Number) id?: number;
	name?: string;
	@ArrayType(String) skills?: HeroSkill[];
	@Type(Number) olderThan?: number;
}

@RequestType({
	responseType: Hero,
	genericTypes: { TRequestBody: HeroesQueryRequestBody },
	scope: 'public'
})
export class HeroesQueryRequest extends ServiceRequestBase<HeroesQueryRequestBody, Hero[]> {
	static serviceName: string = 'NaniumDemo:heroes/query';
}

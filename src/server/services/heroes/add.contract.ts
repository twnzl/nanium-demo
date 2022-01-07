import { ServiceRequestBase } from '../serviceRequestBase';
import { RequestType } from 'nanium/serializers/core';
import { Hero } from './heroes.contractpart';

@RequestType({
	responseType: Hero,
	genericTypes: { TRequestBody: Hero },
	scope: 'public'
})
export class HeroesAddRequest extends ServiceRequestBase<Hero, void> {
	static serviceName: string = 'NaniumDemo:heroes/add';
}

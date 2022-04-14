import { EventBase } from '../eventBase';
import { EventType, Type } from 'nanium/objects';
import { Hero } from '../../services/heroes/heroes.contractpart';

@EventType({
	scope: 'public'
})
export class HeroesCreatedEvent extends EventBase<HeroesCreatedEvent> {
	static eventName: string = 'NaniumTest:heroes/created';

	@Type(Hero) theNewHero: Hero;

	constructor(h: Hero) {
		super();
		this.theNewHero = h;
	}
}

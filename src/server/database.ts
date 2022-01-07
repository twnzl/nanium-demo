import { Hero } from './services/heroes/heroes.contractpart';

export class Database {
	static Heroes: Hero[] = [
		new Hero({
			id: 1,
			name: 'Bubble Bob',
			dob: new Date(2001, 1, 1),
			skills: ['smart', 'other']
		}),
		new Hero({
			id: 2,
			name: 'Jelly Jane',
			dob: new Date(2002, 2, 2),
			skills: ['fast', 'other']
		}),
		new Hero({
			id: 3,
			name: 'Muscle Max',
			dob: new Date(2003, 3, 3),
			skills: ['strong']
		}),
	];

}

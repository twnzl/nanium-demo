import { NaniumObject, Type } from 'nanium/objects';

export class Hero extends NaniumObject<Hero> {
	@Type(Number) id?: number;
	name?: string;
	@Type(Array, String) skills?: HeroSkill[];
	@Type(Date) dob?: Date;

	get age(): number | undefined {
		if (this.dob) {
			const today: Date = new Date();
			let age: number = today.getFullYear() - this.dob.getFullYear();
			const m = today.getMonth() - this.dob.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < this.dob.getDate())) {
				age--;
			}
			return age;
		} else {
			return undefined;
		}
	}
}

export const HeroSkills = ['fast', 'strong', 'smart', 'other'] as const;
export type HeroSkill = typeof HeroSkills[number];

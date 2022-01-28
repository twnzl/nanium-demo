import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hero, HeroSkill, HeroSkills } from '../../../../../server/services/heroes/heroes.contractpart';
import { HeroesQueryRequest } from '../../../../../server/services/heroes/query.contract';
import { HttpClient } from '@angular/common/http';
import { HeroesCreatedEvent } from '../../../../../server/events/heroes/created.event';
import { HeroesAddRequest } from '../../../../../server/services/heroes/add.contract';
import { EventSubscription } from '../../../../../../../nanium/interfaces/eventSubscription';

@Component({
  selector: 'app-hero-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  heroes1: Hero[] = [];
  heroes2: Hero[] = [];

  newHeroName: string = '';
  newHeroSkills: { [key: string]: boolean } = {};

  HeroSkills: any = HeroSkills;
  filter: {
    id?: string;
    name?: string;
    skills: any;
  } = { skills: {} };

  private heroesCreatedSubscription1?: EventSubscription;
  private heroesCreatedSubscription2?: EventSubscription;
  disabledHeroAddedEventHandler1: boolean = true;
  disabledHeroAddedEventHandler2: boolean = true;

  constructor(private http: HttpClient) {
    HeroSkills.forEach(s => this.newHeroSkills[s] = false);
  }

  async ngOnInit(): Promise<void> {
    await this.search();
    await this.toggleEventHandler1();
    await this.toggleEventHandler2();
  }

  async ngOnDestroy(): Promise<void> {
    await this.heroesCreatedSubscription1?.unsubscribe();
    await this.heroesCreatedSubscription2?.unsubscribe();
  }

  async search(): Promise<void> {
    const filterSkills: HeroSkill[] = Object.keys(this.filter.skills).filter(s => this.filter.skills[s]) as HeroSkill[]

    // call nanium
    this.heroes2 = await new HeroesQueryRequest({
      id: this.filter.id ? parseInt(this.filter.id) : undefined,
      name: this.filter.name || undefined,
      skills: filterSkills
    }).execute();

    // call classic api
    const query: string[] = filterSkills.map(s => 'skills=' + s);
    if (this.filter.id) {
      query.push('id=' + this.filter.id);
    }
    if (this.filter.name) {
      query.push('name=' + this.filter.name);
    }
    this.heroes1 = await this.http.get<Hero[]>(
      'http://localhost:3000/c-api/heroes?' + query.join('&')).toPromise();
  }

  addHero() {
    new HeroesAddRequest(new Hero({
      name: this.newHeroName,
      skills: Object.keys(this.newHeroSkills).filter(s => this.newHeroSkills[s]).map(s => s as HeroSkill)
    })).execute().then();
  }

  async toggleEventHandler1(): Promise<void> {
    if (!this.disabledHeroAddedEventHandler1) {
      this.heroesCreatedSubscription1 = await HeroesCreatedEvent.subscribe((event: HeroesCreatedEvent) => {
        this.heroes2.push(event.theNewHero);
      });
    } else if (this.heroesCreatedSubscription1) {
      await this.heroesCreatedSubscription1?.unsubscribe();
      this.heroesCreatedSubscription1 = undefined;
    }
  }

  async toggleEventHandler2(): Promise<void> {
    if (!this.disabledHeroAddedEventHandler2) {
      this.heroesCreatedSubscription2 = await HeroesCreatedEvent.subscribe((event: HeroesCreatedEvent) => {
        console.log('HeroesCreatedEvent: ' + event.theNewHero.name);
      });
    } else if (this.heroesCreatedSubscription2) {
      await HeroesCreatedEvent.unsubscribe(this.heroesCreatedSubscription2);
      this.heroesCreatedSubscription2 = undefined;
    }
  }
}

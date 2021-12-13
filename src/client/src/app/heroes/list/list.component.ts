import { Component, OnInit } from '@angular/core';
import { Hero, HeroSkill, HeroSkills } from '../../../../../server/services/heroes/heroes.contractpart';
import { HeroesQueryRequest } from '../../../../../server/services/heroes/query.contract';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hero-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  heroes1: Hero[] = [];
  heroes2: Hero[] = [];

  HeroSkills: any = HeroSkills;
  filter: {
    id?: string;
    name?: string;
    skills: any;
  } = { skills: {} };

  constructor(private http: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    await this.search();
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
    this.heroes1 = (await this.http.get<Hero[]>(
        'http://localhost:3000/c-api/heroes?' + query.join('&')).toPromise()
    );
  }
}

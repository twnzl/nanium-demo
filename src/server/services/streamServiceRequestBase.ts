import { Nanium } from 'nanium/core';
import { Observable } from 'rxjs';
import { ServiceRequestHead } from './serviceRequestHead';
import { Type } from 'nanium/objects';

export class StreamServiceRequestBase<TRequestBody, TResult> {

	@Type(ServiceRequestHead)
	head?: ServiceRequestHead;

	@Type('TRequestBody')
	body: TRequestBody;


	constructor(body?: TRequestBody, head?: ServiceRequestHead) {
		this.body = body ?? {} as TRequestBody;
		this.head = head;
	}

	async execute(): Promise<Array<TResult>> {
		return await new Promise<TResult[]>((resolve, reject) => {
			const result: TResult[] = [];
			this.stream().subscribe({
				next: (value: TResult): void => {
					result.push(value);
				},
				complete: (): void => {
					resolve(result);
				},
				error: (e: any): void => {
					reject(e);
				}
			});
		});
	}

	stream(): Observable<TResult> {
		return Nanium.stream<TResult>(this);
	}
}

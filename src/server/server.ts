import * as http from 'http';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Nanium } from 'nanium/core';
import { NaniumNodejsProvider } from 'nanium/managers/providers/nodejs';
import { NaniumHttpChannel } from 'nanium/managers/providers/channels/http';
import { Database } from './database';
import * as fs from 'fs';
import { Hero, HeroSkill } from './services/heroes/heroes.contractpart';
import { URL } from 'url';
import * as querystring from 'querystring';
import { DemoEventEmissionSendInterceptor, DemoEventSubscriptionReceiveInterceptor } from './events/main.interceptor';
import { NaniumRestChannel } from 'nanium-channel-rest';
import { HeroesQueryRequest } from './services/heroes/query.contract';

async function run(): Promise<void> {

	// init http server
	const server: Server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {

		//#region CORS
		if (req.headers.origin?.startsWith('http://localhost:4200') && req.headers.host === ('localhost:3000')) {
			res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
			res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.headers.origin);
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		}
		if (req.method === 'OPTIONS') {
			res.statusCode = 200;
			res.end();
			return;
		}
		//#endregion CORS

		//#region provide client as static files
		if (req.url?.startsWith('/client/')) {
			fs.readFile(__dirname + req.url, (err, data) => {
				if (err) {
					res.writeHead(404);
					res.end(JSON.stringify(err));
					return;
				}
				res.writeHead(200);
				res.end(data);
			});
			return;
		}
		//#endregion provide client as static files

		// classic API
		// await handleClassicApi(req, res); -- uncommented because this is now done via the NaniumRestChannel
	});

	// start the http server
	server.listen(3000);


	// init nanium API
	await Nanium.addManager(new NaniumNodejsProvider({
		servicePath: 'services',
		channels: [
			new NaniumHttpChannel({ apiPath: '/api', eventPath: '/events', server: server }),
			new NaniumRestChannel({ apiBasePath: '/c-api', server: server })
		],
		eventSubscriptionReceiveInterceptors: [DemoEventSubscriptionReceiveInterceptor],
		eventEmissionSendInterceptors: [DemoEventEmissionSendInterceptor]
	}));

	// nanium example: execute HeroesQueryRequest on the server
	const heroes: Hero[] = await new HeroesQueryRequest({ skills: ['other'] }).execute();
	heroes.forEach(h => console.log(h.name));
}

async function handleClassicApi(req: IncomingMessage, res: ServerResponse): Promise<any> {
	try {

		//#region parse query string
		const url: URL = new URL('http://dummy' + req.url);
		let params: any = {};
		if (url.search?.startsWith('?')) {
			params = querystring.decode(url.search.substr(1));
		}
		//#endregion parse query string

		//#region parse body
		let request: any;
		if (url.pathname.startsWith('/c-api/')) {
			const data: any[] = [];
			req.on('data', (chunk: any) => {
				data.push(chunk);
			}).on('end', async () => {
				const body: string = Buffer.concat(data).toString();
				if (body !== undefined && body !== '') {
					request = await JSON.parse(body);
				}
			});
		}
		//#endregion parse body

		//#region code for the different endpoints
		let result = await heroListEndpoint(req, res, url, params);
		//#region code for the different endpoints

		//#region serialize and return result
		res.write(JSON.stringify(result));
		res.end();
		//#endregion serialize and return result

	} catch (e) {
		console.log(e);
		res.statusCode = 500;
		res.end('error');
	}
}

//#region classic hero endpoint
async function heroListEndpoint(req: IncomingMessage, res: ServerResponse, url: URL, params: any): Promise<any> {
	if (url.pathname === '/c-api/heroes' && req.method === 'GET') {
		let result: Hero[] = Database.Heroes;
		if (params.id) {
			// the url parsing does not know that params.id must be a number
			// params.id = parseInt(params.id);
			result = result.filter(h => h.id === params.id);
		}
		if (params.name) {
			result = result.filter(h => h.name?.toLowerCase().includes((params.name ?? '').toLowerCase()));
		}
		if (params.skills) {
			// the url parsing can not always know if params.skills must be an array or not.
			// if multiple skills are set it is clear but if only one is set the type will be string
			// params.skills = Array.isArray(params.skills) ? params.skills : [params.skills];
			if (params.skills?.length) {
				result = result.filter(h => params.skills?.every((s: HeroSkill) => h.skills?.includes(s)));
			}
		}
		return result;
	}
}

//#region classic hero endpoint

run().then();

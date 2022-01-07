import { ExecutionScope } from 'nanium/interfaces/executionScope';
import { ExecutionContext } from 'nanium/interfaces/executionContext';

export class ServiceRequestContext implements ExecutionContext {
	scope?: ExecutionScope;
	user?: string;
	tenant?: string;

	constructor(data: Partial<ServiceRequestContext>) {
		Object.assign(this, data);
	}

	asPrivate(): ServiceRequestContext {
		return new ServiceRequestContext({
			...this,
			...{ scope: 'private' }
		});
	}
}

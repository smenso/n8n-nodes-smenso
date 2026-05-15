import { INodeProperties } from 'n8n-workflow';

export const flavorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['flavor'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'Get all flavors (custom fields) from the workspace', action: 'Get many flavors' },
			{ name: 'Delete', value: 'delete', description: 'Delete a flavor by ID', action: 'Delete a flavor' },
		],
		default: 'getMany',
	},
];

export const flavorFields: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['flavor'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},
	{
		displayName: 'Flavor ID',
		name: 'flavorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['flavor'], operation: ['delete'] } },
	},
];

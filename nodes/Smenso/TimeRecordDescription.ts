import { INodeProperties } from 'n8n-workflow';

export const timeRecordOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timeRecord'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'Get time records for a project', action: 'Get many time records' },
			{ name: 'Create', value: 'create', description: 'Create time records (async – returns ticketId)', action: 'Create a time record' },
			{ name: 'Update', value: 'update', description: 'Update time records (async – returns ticketId)', action: 'Update a time record' },
			{ name: 'Delete', value: 'delete', description: 'Delete a time record', action: 'Delete a time record' },
		],
		default: 'getMany',
	},
];

export const timeRecordFields: INodeProperties[] = [
	// ─── Get Many ────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['getMany', 'create'] } },
		description: 'The GUID of the project',
	},
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['timeRecord'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Delete ──────────────────────────────────────────────────────────────
	{
		displayName: 'Time Record ID',
		name: 'timeRecordId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['delete'] } },
		description: 'The GUID of the time record',
	},

	// ─── Create ──────────────────────────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['create'] } },
		description: 'The GUID of the task to book time against',
	},
	{
		displayName: 'User ID or Email',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['create'] } },
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['create'] } },
		description: 'The date the time was recorded',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['timeRecord'], operation: ['create'] } },
		options: [
			{ displayName: 'Duration (Minutes)', name: 'duration', type: 'number', default: 0, description: 'Duration in minutes (use either duration or start/end date)' },
			{ displayName: 'Start Date/Time', name: 'startDate', type: 'dateTime', default: '', description: 'Use with End Date instead of Duration' },
			{ displayName: 'End Date/Time', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Status ID', name: 'statusId', type: 'number', default: 0 },
			{ displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Update ──────────────────────────────────────────────────────────────
	{
		displayName: 'Time Record ID',
		name: 'timeRecordId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['update'] } },
		description: 'GUID or externalId of the time record',
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeRecord'], operation: ['update'] } },
	},
	{
		displayName: 'Use External ID',
		name: 'useExternalId',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['timeRecord'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['timeRecord'], operation: ['update'] } },
		options: [
			{ displayName: 'Duration (Minutes)', name: 'duration', type: 'number', default: 0 },
			{ displayName: 'Start Date/Time', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date/Time', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Locked', name: 'locked', type: 'boolean', default: false },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},
];

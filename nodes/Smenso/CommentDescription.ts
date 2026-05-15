import { INodeProperties } from 'n8n-workflow';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['comment'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a comment by ID', action: 'Get a comment' },
			{ name: 'Get Many (Task)', value: 'getManyTask', description: 'Get all comments for a task', action: 'Get task comments' },
			{ name: 'Get Many (Status Report)', value: 'getManyStatusReport', description: 'Get all comments for a status report', action: 'Get status report comments' },
			{ name: 'Create (Task)', value: 'createTask', description: 'Create comments on tasks (async – returns ticketId)', action: 'Create task comment' },
			{ name: 'Create (Status Report)', value: 'createStatusReport', description: 'Create comments on status reports (async – returns ticketId)', action: 'Create status report comment' },
			{ name: 'Update (Task)', value: 'updateTask', description: 'Update task comments (async – returns ticketId)', action: 'Update task comment' },
			{ name: 'Update (Status Report)', value: 'updateStatusReport', description: 'Update status report comments (async – returns ticketId)', action: 'Update status report comment' },
			{ name: 'Delete', value: 'delete', description: 'Delete a comment', action: 'Delete a comment' },
		],
		default: 'getManyTask',
	},
];

export const commentFields: INodeProperties[] = [
	// ─── Get / Delete single ──────────────────────────────────────────────────
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['get', 'delete'] } },
	},
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['comment'], operation: ['get'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Get Many Task ───────────────────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['getManyTask'] } },
	},
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['comment'], operation: ['getManyTask'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Get Many Status Report ───────────────────────────────────────────────
	{
		displayName: 'Status Report ID',
		name: 'statusReportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['getManyStatusReport'] } },
	},
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['comment'], operation: ['getManyStatusReport'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Create Task Comment ──────────────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['createTask'] } },
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['createTask', 'createStatusReport'] } },
	},
	{
		displayName: 'Is Internal',
		name: 'isInternal',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['comment'], operation: ['createTask', 'createStatusReport'] } },
		description: 'Internal comments are not visible to guests',
	},

	// ─── Create Status Report Comment ─────────────────────────────────────────
	{
		displayName: 'Status Report ID',
		name: 'statusReportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['createStatusReport'] } },
	},

	// ─── Update Comments ─────────────────────────────────────────────────────
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['updateTask', 'updateStatusReport'] } },
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['updateTask', 'updateStatusReport'] } },
	},
	{
		displayName: 'Is Internal',
		name: 'isInternal',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['comment'], operation: ['updateTask', 'updateStatusReport'] } },
	},
];

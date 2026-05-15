import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['task'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'Get tasks for a project', action: 'Get many tasks' },
			{ name: 'Get Tree', value: 'getTree', description: 'Get a task with all its subtasks', action: 'Get task tree' },
			{ name: 'Create', value: 'create', description: 'Create tasks (async – returns ticketId)', action: 'Create a task' },
			{ name: 'Update', value: 'update', description: 'Update tasks (async – returns ticketId)', action: 'Update a task' },
			{ name: 'Delete', value: 'delete', description: 'Delete a task', action: 'Delete a task' },
			{ name: 'Create From Template', value: 'createFromTemplate', description: 'Create a task from a task template', action: 'Create task from template' },
			{ name: 'Update Dependencies', value: 'updateDependencies', description: 'Add or modify task dependencies (PATCH)', action: 'Update task dependencies' },
			{ name: 'Remove Dependencies', value: 'removeDependencies', description: 'Remove task dependencies', action: 'Remove task dependencies' },
		],
		default: 'getMany',
	},
];

export const taskFields: INodeProperties[] = [
	// ─── Get Many ────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['getMany', 'create'] } },
		description: 'The GUID of the project',
	},
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
			{ displayName: 'View ID', name: 'viewId', type: 'string', default: '' },
		],
	},

	// ─── Get Tree ────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['getTree', 'updateDependencies', 'removeDependencies'] } },
		description: 'The GUID of the project',
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['getTree', 'delete', 'updateDependencies', 'removeDependencies'] } },
		description: 'The GUID of the task',
	},

	// ─── Create ──────────────────────────────────────────────────────────────
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		options: [
			{ displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Planned Hours', name: 'plannedHours', type: 'number', default: 0 },
			{ displayName: 'Responsible User ID', name: 'responsibleUserId', type: 'string', default: '' },
			{ displayName: 'Parent Task ID', name: 'parentTaskId', type: 'string', default: '' },
			{ displayName: 'Sort Order', name: 'sortOrder', type: 'number', default: 0 },
			{ displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
			{ displayName: 'No Feed', name: 'noFeed', type: 'boolean', default: false },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Update ──────────────────────────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['update'] } },
		description: 'The GUID of the task to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['update'] } },
		options: [
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Planned Hours', name: 'plannedHours', type: 'number', default: 0 },
			{ displayName: 'Responsible User ID', name: 'responsibleUserId', type: 'string', default: '' },
			{ displayName: 'Parent Task ID', name: 'parentTaskId', type: 'string', default: '' },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Create From Template ─────────────────────────────────────────────────
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['createFromTemplate'] } },
		description: 'The GUID of the task template',
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['createFromTemplate'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['createFromTemplate'] } },
		options: [
			{ displayName: 'Title (override template title)', name: 'title', type: 'string', default: '' },
			{ displayName: 'Override Status', name: 'overrideStatus', type: 'boolean', default: false },
			{ displayName: 'Override Priority', name: 'overridePriority', type: 'boolean', default: false },
			{ displayName: 'Override Workflow', name: 'overrideWorkflow', type: 'boolean', default: false },
		],
	},

	// ─── Update Dependencies ─────────────────────────────────────────────────
	{
		displayName: 'Predecessor Task IDs (JSON)',
		name: 'dependencyJson',
		type: 'json',
		required: true,
		default: '[{"taskId":"<predecessor-id>","type":"FS","lag":0}]',
		displayOptions: { show: { resource: ['task'], operation: ['updateDependencies'] } },
		description: 'Array of dependency objects: [{taskId, type (FS/SS/FF/SF), lag}]',
	},

	// ─── Remove Dependencies ─────────────────────────────────────────────────
	{
		displayName: 'Predecessor Task IDs (comma-separated)',
		name: 'predecessorIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['removeDependencies'] } },
		description: 'Comma-separated GUIDs of predecessor tasks to remove',
	},
];

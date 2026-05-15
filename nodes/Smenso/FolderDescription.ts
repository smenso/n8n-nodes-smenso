import { INodeProperties } from 'n8n-workflow';

export const folderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['folder'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'Get folders for a project', action: 'Get many folders' },
			{ name: 'Create', value: 'create', description: 'Create folders (async – returns ticketId)', action: 'Create a folder' },
			{ name: 'Update', value: 'update', description: 'Update folders (async – returns ticketId)', action: 'Update a folder' },
			{ name: 'Delete', value: 'delete', description: 'Delete a folder', action: 'Delete a folder' },
		],
		default: 'getMany',
	},
];

export const folderFields: INodeProperties[] = [
	// ─── Get Many ────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['getMany'] } },
	},
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['folder'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Delete ──────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['delete'] } },
		description: 'The GUID of the project this folder belongs to',
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['delete'] } },
	},

	// ─── Create ──────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
		options: [
			{ displayName: 'Priority', name: 'priority', type: 'options', options: [{ name: 'None', value: 'none' }, { name: 'Low', value: 'low' }, { name: 'Medium', value: 'medium' }, { name: 'High', value: 'high' }, { name: 'Highest', value: 'highest' }], default: 'none' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 2 }, default: '' },
			{ displayName: 'Color (hex)', name: 'color', type: 'string', default: '', placeholder: '#FF0000' },
			{ displayName: 'Fill Row With Color', name: 'fillRowWithColor', type: 'boolean', default: false },
			{ displayName: 'No New Tasks Allowed', name: 'noNewTasksAllowed', type: 'boolean', default: false },
			{ displayName: 'Lock New Tasks', name: 'lockNewTasks', type: 'boolean', default: false },
			{ displayName: 'Private New Tasks', name: 'privateNewTasks', type: 'boolean', default: false },
			{ displayName: 'Locked', name: 'locked', type: 'boolean', default: false },
			{ displayName: 'Task Template ID', name: 'taskTemplateId', type: 'string', default: '' },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Update ──────────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Priority', name: 'priority', type: 'options', options: [{ name: 'None', value: 'none' }, { name: 'Low', value: 'low' }, { name: 'Medium', value: 'medium' }, { name: 'High', value: 'high' }, { name: 'Highest', value: 'highest' }], default: 'none' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 2 }, default: '' },
			{ displayName: 'Color (hex)', name: 'color', type: 'string', default: '' },
			{ displayName: 'Fill Row With Color', name: 'fillRowWithColor', type: 'boolean', default: false },
			{ displayName: 'No New Tasks Allowed', name: 'noNewTasksAllowed', type: 'boolean', default: false },
			{ displayName: 'Lock New Tasks', name: 'lockNewTasks', type: 'boolean', default: false },
			{ displayName: 'Locked', name: 'locked', type: 'boolean', default: false },
		],
	},
];

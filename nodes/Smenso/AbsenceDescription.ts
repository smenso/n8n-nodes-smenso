import { INodeProperties } from 'n8n-workflow';

export const absenceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['absence'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'Get all absences from the workspace', action: 'Get many absences' },
			{ name: 'Create', value: 'create', description: 'Create absences (async – returns ticketId)', action: 'Create an absence' },
			{ name: 'Update', value: 'update', description: 'Update absences (async – returns ticketId)', action: 'Update an absence' },
			{ name: 'Delete', value: 'delete', description: 'Delete an absence', action: 'Delete an absence' },
		],
		default: 'getMany',
	},
];

export const absenceFields: INodeProperties[] = [
	// ─── Get Many ────────────────────────────────────────────────────────────
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['absence'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Delete ──────────────────────────────────────────────────────────────
	{
		displayName: 'Absence ID',
		name: 'absenceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['absence'], operation: ['delete'] } },
		description: 'The GUID of the absence',
	},

	// ─── Create ──────────────────────────────────────────────────────────────
	{
		displayName: 'User ID or Email',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['absence'], operation: ['create'] } },
	},
	{
		displayName: 'Absence Type ID or Name',
		name: 'absenceTypeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['absence'], operation: ['create'] } },
		description: 'GUID or name of the absence type (e.g. "Vacation")',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['absence'], operation: ['create'] } },
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['absence'], operation: ['create'] } },
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		options: [
			{ name: 'Submitted', value: 'submitted' },
			{ name: 'Approved', value: 'approved' },
			{ name: 'Rejected', value: 'rejected' },
		],
		default: 'submitted',
		displayOptions: { show: { resource: ['absence'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['absence'], operation: ['create'] } },
		options: [
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '' },
			{ displayName: 'Locked', name: 'locked', type: 'boolean', default: false },
			{ displayName: 'Start Date Minutes', name: 'startDateMinutes', type: 'number', default: 0, description: 'Minutes on start day (overrides default daily capacity)' },
			{ displayName: 'End Date Minutes', name: 'endDateMinutes', type: 'number', default: 0 },
			{ displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Update ──────────────────────────────────────────────────────────────
	{
		displayName: 'Absence ID',
		name: 'absenceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['absence'], operation: ['update'] } },
		description: 'GUID or externalId of the absence',
	},
	{
		displayName: 'Use External ID',
		name: 'useExternalId',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['absence'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['absence'], operation: ['update'] } },
		options: [
			{ displayName: 'User ID or Email', name: 'userId', type: 'string', default: '' },
			{ displayName: 'Absence Type ID or Name', name: 'absenceTypeId', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Submitted', value: 'submitted' }, { name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }], default: 'submitted' },
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '' },
			{ displayName: 'Locked', name: 'locked', type: 'boolean', default: false },
			{ displayName: 'Start Date Minutes', name: 'startDateMinutes', type: 'number', default: 0 },
			{ displayName: 'End Date Minutes', name: 'endDateMinutes', type: 'number', default: 0 },
			{ displayName: 'Timezone ID', name: 'timezoneId', type: 'string', default: 'W. Europe Standard Time' },
		],
	},
];

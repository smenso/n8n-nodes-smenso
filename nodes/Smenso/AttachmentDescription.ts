import { INodeProperties } from 'n8n-workflow';

export const attachmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['attachment'] } },
		options: [
			{ name: 'Download', value: 'download', description: 'Download an attachment by ID', action: 'Download an attachment' },
			{ name: 'Delete', value: 'delete', description: 'Delete an attachment', action: 'Delete an attachment' },
			{ name: 'Get Project Attachments', value: 'getProject', description: 'List attachments for a project', action: 'Get project attachments' },
			{ name: 'Get Task Attachments', value: 'getTask', description: 'List attachments for a task', action: 'Get task attachments' },
			{ name: 'Get Status Report Attachments', value: 'getStatusReport', description: 'List attachments for a status report', action: 'Get status report attachments' },
		],
		default: 'getProject',
	},
];

export const attachmentFields: INodeProperties[] = [
	// ─── Download / Delete ───────────────────────────────────────────────────
	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['attachment'], operation: ['download', 'delete'] } },
	},

	// ─── Get Project ─────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['attachment'], operation: ['getProject'] } },
	},
	{
		displayName: 'Include All (project + task + status report attachments)',
		name: 'projectOnly',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['attachment'], operation: ['getProject'] } },
		description: 'true = all project files incl. tasks/status reports; false = only project-level attachments',
	},

	// ─── Get Task ────────────────────────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['attachment'], operation: ['getTask'] } },
	},

	// ─── Get Status Report ───────────────────────────────────────────────────
	{
		displayName: 'Status Report ID',
		name: 'statusReportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['attachment'], operation: ['getStatusReport'] } },
	},
];

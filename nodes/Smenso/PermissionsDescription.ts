import { INodeProperties } from 'n8n-workflow';

export const permissionsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['permissions'] } },
		options: [
			{ name: 'Get Project Permissions', value: 'getProject', description: 'Get project permission/privacy settings', action: 'Get project permissions' },
			{ name: 'Set Project Access', value: 'setProjectAccess', description: 'Add or remove project access for users/teams', action: 'Set project access' },
			{ name: 'Delete Project Access', value: 'deleteProjectAccess', description: 'Remove all project access restrictions', action: 'Delete project access' },
			{ name: 'Set Project Privacy', value: 'setProjectPrivacy', description: 'Add or remove private access for users/teams', action: 'Set project privacy' },
			{ name: 'Delete Project Privacy', value: 'deleteProjectPrivacy', description: 'Remove project privacy restrictions', action: 'Delete project privacy' },
			{ name: 'Get Task Permissions', value: 'getTask', description: 'Get task permission/privacy settings', action: 'Get task permissions' },
			{ name: 'Set Task Access', value: 'setTaskAccess', description: 'Add or remove task access for users/teams', action: 'Set task access' },
			{ name: 'Delete Task Access', value: 'deleteTaskAccess', description: 'Remove all task access restrictions', action: 'Delete task access' },
			{ name: 'Set Task Privacy', value: 'setTaskPrivacy', description: 'Set task as private with user/team access', action: 'Set task privacy' },
			{ name: 'Delete Task Privacy', value: 'deleteTaskPrivacy', description: 'Remove task privacy restrictions', action: 'Delete task privacy' },
		],
		default: 'getProject',
	},
];

export const permissionsFields: INodeProperties[] = [
	// ─── Project operations ───────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['permissions'], operation: ['getProject', 'setProjectAccess', 'deleteProjectAccess', 'setProjectPrivacy', 'deleteProjectPrivacy'] } },
	},

	// ─── Task operations ──────────────────────────────────────────────────────
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['permissions'], operation: ['getTask', 'setTaskAccess', 'deleteTaskAccess', 'setTaskPrivacy', 'deleteTaskPrivacy'] } },
	},

	// ─── Get options ─────────────────────────────────────────────────────────
	{
		displayName: 'Options',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['permissions'], operation: ['getProject', 'getTask'] } },
		options: [
			{ displayName: 'Language', name: 'lang', type: 'string', default: 'de-DE' },
			{ displayName: 'Timezone', name: 'timezone', type: 'string', default: 'W. Europe Standard Time' },
		],
	},

	// ─── Access add/remove ───────────────────────────────────────────────────
	{
		displayName: 'Add Access: Users (comma-separated emails/IDs)',
		name: 'addUsers',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['permissions'], operation: ['setProjectAccess', 'setProjectPrivacy', 'setTaskAccess', 'setTaskPrivacy'] } },
	},
	{
		displayName: 'Add Access: Teams (comma-separated names/IDs)',
		name: 'addTeams',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['permissions'], operation: ['setProjectAccess', 'setProjectPrivacy', 'setTaskAccess', 'setTaskPrivacy'] } },
	},
	{
		displayName: 'Remove Access: Users (comma-separated)',
		name: 'removeUsers',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['permissions'], operation: ['setProjectAccess', 'setProjectPrivacy', 'setTaskAccess', 'setTaskPrivacy'] } },
	},
	{
		displayName: 'Remove Access: Teams (comma-separated)',
		name: 'removeTeams',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['permissions'], operation: ['setProjectAccess', 'setProjectPrivacy', 'setTaskAccess', 'setTaskPrivacy'] } },
	},

	// ─── Delete task access options ───────────────────────────────────────────
	{
		displayName: 'Include Subtasks',
		name: 'includeSubtasks',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['permissions'], operation: ['deleteTaskAccess'] } },
	},
];

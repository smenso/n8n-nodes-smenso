import { INodeProperties } from 'n8n-workflow';

export const reportingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['reporting'] } },
		options: [
			{ name: 'Get Projects', value: 'getProjects', description: 'Export all projects (CSV/JSON)', action: 'Report: Get projects' },
			{ name: 'Get Project', value: 'getProject', description: 'Export a single project', action: 'Report: Get project' },
			{ name: 'Get Tasks for Project', value: 'getTasks', description: 'Export tasks for a project (CSV/JSON)', action: 'Report: Get tasks' },
			{ name: 'Get Tasks by Filter', value: 'getTasksFiltered', description: 'Export tasks across projects by filter', action: 'Report: Get tasks by filter' },
			{ name: 'Get Time Records', value: 'getTimeRecords', description: 'Export time records (CSV/JSON)', action: 'Report: Get time records' },
			{ name: 'Get Absences', value: 'getAbsences', description: 'Export absence records (CSV/JSON)', action: 'Report: Get absences' },
			{ name: 'Get Teams', value: 'getTeams', description: 'Export all teams', action: 'Report: Get teams' },
			{ name: 'Get Flavors', value: 'getFlavors', description: 'Export all flavors', action: 'Report: Get flavors' },
			{ name: 'Get Member Settings', value: 'getMemberSettings', description: 'Export member settings', action: 'Report: Get member settings' },
		],
		default: 'getProjects',
	},
];

export const reportingFields: INodeProperties[] = [
	// ─── Shared options ───────────────────────────────────────────────────────
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [{ name: 'JSON', value: 'JSON' }, { name: 'CSV', value: 'CSV' }],
		default: 'JSON',
		displayOptions: { show: { resource: ['reporting'], operation: ['getProjects', 'getProject', 'getTasks', 'getTasksFiltered', 'getTimeRecords', 'getAbsences', 'getTeams', 'getFlavors', 'getMemberSettings'] } },
	},
	{
		displayName: 'Language',
		name: 'lang',
		type: 'string',
		default: 'de-DE',
		displayOptions: { show: { resource: ['reporting'] } },
	},
	{
		displayName: 'Timezone (IANA)',
		name: 'timezone',
		type: 'string',
		default: 'Europe/Berlin',
		displayOptions: { show: { resource: ['reporting'] } },
		description: 'IANA timezone (e.g. Europe/Berlin)',
	},

	// ─── Project filter ───────────────────────────────────────────────────────
	{
		displayName: 'Project Filter',
		name: 'globalProjectsFilter',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Active', value: 'active' },
			{ name: 'Archived', value: 'archived' },
			{ name: 'Templates', value: 'templates' },
		],
		default: 'active',
		displayOptions: { show: { resource: ['reporting'], operation: ['getProjects', 'getProject', 'getTasksFiltered'] } },
	},

	// ─── View / Headers ───────────────────────────────────────────────────────
	{
		displayName: 'View ID',
		name: 'view',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['reporting'], operation: ['getProjects', 'getProject', 'getTasks', 'getTasksFiltered', 'getTimeRecords'] } },
		description: 'ID of a saved view configuration',
	},
	{
		displayName: 'Column Headers (comma-separated)',
		name: 'headers',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['reporting'], operation: ['getProjects', 'getProject', 'getTasks', 'getTasksFiltered', 'getTimeRecords', 'getAbsences'] } },
	},

	// ─── Project IDs ──────────────────────────────────────────────────────────
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['reporting'], operation: ['getProject', 'getTasks'] } },
	},

	// ─── Time records / Absences mode ─────────────────────────────────────────
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [{ name: 'All', value: 'all' }, { name: 'My Records', value: 'my' }],
		default: 'all',
		displayOptions: { show: { resource: ['reporting'], operation: ['getTimeRecords', 'getAbsences'] } },
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['reporting'], operation: ['getTimeRecords', 'getAbsences'] } },
		description: 'Optional filter expression',
	},
];

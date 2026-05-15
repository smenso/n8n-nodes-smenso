import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

import { projectFields, projectOperations } from './ProjectDescription';
import { taskFields, taskOperations } from './TaskDescription';
import { absenceFields, absenceOperations } from './AbsenceDescription';
import { timeRecordFields, timeRecordOperations } from './TimeRecordDescription';
import { statusReportFields, statusReportOperations } from './StatusReportDescription';
import { commentFields, commentOperations } from './CommentDescription';
import { folderFields, folderOperations } from './FolderDescription';
import { attachmentFields, attachmentOperations } from './AttachmentDescription';
import { flavorFields, flavorOperations } from './FlavorDescription';
import { permissionsFields, permissionsOperations } from './PermissionsDescription';
import { settingsFields, settingsOperations } from './SettingsDescription';
import { reportingFields, reportingOperations } from './ReportingDescription';

export class Smenso implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Smenso',
		name: 'smenso',
		icon: 'file:smenso.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the smenso project management API',
		defaults: { name: 'smenso' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'smensoApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Absence', value: 'absence' },
					{ name: 'Attachment', value: 'attachment' },
					{ name: 'Comment', value: 'comment' },
					{ name: 'Flavor', value: 'flavor' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Permissions', value: 'permissions' },
					{ name: 'Project', value: 'project' },
					{ name: 'Reporting (Export)', value: 'reporting' },
					{ name: 'Settings / Utilities', value: 'settings' },
					{ name: 'Status Report', value: 'statusReport' },
					{ name: 'Task', value: 'task' },
					{ name: 'Time Record', value: 'timeRecord' },
				],
				default: 'project',
			},
			...projectOperations, ...projectFields,
			...taskOperations, ...taskFields,
			...absenceOperations, ...absenceFields,
			...timeRecordOperations, ...timeRecordFields,
			...statusReportOperations, ...statusReportFields,
			...commentOperations, ...commentFields,
			...folderOperations, ...folderFields,
			...attachmentOperations, ...attachmentFields,
			...flavorOperations, ...flavorFields,
			...permissionsOperations, ...permissionsFields,
			...settingsOperations, ...settingsFields,
			...reportingOperations, ...reportingFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('smensoApi');
		const base = `https://${credentials.workspace}.smenso.cloud/skyisland`;
		const headers: IDataObject = {
			Authorization: `Basic ${credentials.apiToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		};
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];
				if (resource === 'project') responseData = await handleProject(this, i, base, headers, operation);
				else if (resource === 'task') responseData = await handleTask(this, i, base, headers, operation);
				else if (resource === 'absence') responseData = await handleAbsence(this, i, base, headers, operation);
				else if (resource === 'timeRecord') responseData = await handleTimeRecord(this, i, base, headers, operation);
				else if (resource === 'statusReport') responseData = await handleStatusReport(this, i, base, headers, operation);
				else if (resource === 'comment') responseData = await handleComment(this, i, base, headers, operation);
				else if (resource === 'folder') responseData = await handleFolder(this, i, base, headers, operation);
				else if (resource === 'attachment') responseData = await handleAttachment(this, i, base, headers, operation);
				else if (resource === 'flavor') responseData = await handleFlavor(this, i, base, headers, operation);
				else if (resource === 'permissions') responseData = await handlePermissions(this, i, base, headers, operation);
				else if (resource === 'settings') responseData = await handleSettings(this, i, base, headers, operation);
				else if (resource === 'reporting') responseData = await handleReporting(this, i, base, headers, operation);
				else responseData = {};

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } as unknown as IDataObject, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as unknown as JsonObject);
			}
		}
		return [returnData];
	}
}

// ─── PROJECT ──────────────────────────────────────────────────────────────────
async function handleProject(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const api = `${base}/api/integration/project/json`;
	if (op === 'getMany') {
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: api, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'get') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'GET', url: `${api}/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'create') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			timezoneId: af.timezoneId ?? 'W. Europe Standard Time',
			noFeed: af.noFeed ?? false,
			project: [{
				title: ctx.getNodeParameter('title', i),
				phaseId: ctx.getNodeParameter('phaseId', i),
				typeId: ctx.getNodeParameter('typeId', i),
				description: af.description ?? null, goal: af.goal ?? null, benefit: af.benefit ?? null,
				startDate: af.startDate ?? null, endDate: af.endDate ?? null,
				budget: af.budget ?? null, currency: af.currency ?? null,
				departmentId: af.departmentId ?? null, locationId: af.locationId ?? null,
				projectManager: af.projectManager ?? null, statusId: af.statusId ?? null,
				workflowId: af.workflowId ?? null, hourlyRate: af.hourlyRate ?? null,
				usePersonalHourlyRates: af.usePersonalHourlyRates ?? null,
				blockTimeRecording: af.blockTimeRecording ?? null,
				externalId: af.externalId ?? null, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'update') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { timezoneId: 'W. Europe Standard Time', project: [{ id, useExternalId: false, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'archive') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/project/json/archive/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'unarchive') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/project/json/unarchive/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'createFromTemplate') {
		const templateId = ctx.getNodeParameter('templateId', i) as string;
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			title: ctx.getNodeParameter('title', i),
			folder: ctx.getNodeParameter('folder', i),
			projectType: ctx.getNodeParameter('projectType', i),
			isPrivate: af.isPrivate ?? false,
			startDate: af.startDate ?? undefined,
			statusId: af.statusId ?? undefined,
			code: af.code ?? undefined,
			options: {
				tasks: af.optTasks ?? true, flavors: af.optFlavors ?? true, budget: af.optBudget ?? true,
				description: af.optDescription ?? true, manager: af.optManager ?? true,
				permissions: af.optPermissions ?? true, adjustTaskDates: af.optAdjustTaskDates ?? true,
				startDate: true, labels: true, tasksWorkflow: true, tasksTemplate: true,
				folderTasksTemplate: true, viewSettings: true, location: true,
				hourlyRate: true, goal: true, benefit: true, observers: true,
				blockTimeRecording: true, markedColumns: true, columnDescriptions: true,
			},
		};
		return ctx.helpers.request({ method: 'POST', url: `${api}/${templateId}`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'updateMasterDataFromTemplate') {
		const templateId = ctx.getNodeParameter('templateId', i) as string;
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const tf = ctx.getNodeParameter('templateApplyFields', i, {}) as IDataObject;
		const body: IDataObject = { projectId, ...tf };
		return ctx.helpers.request({ method: 'PUT', url: `${api}/${templateId}`, headers, body, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown project operation: ${op}`);
}

// ─── TASK ─────────────────────────────────────────────────────────────────────
async function handleTask(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const api = `${base}/api/integration/task/json`;
	if (op === 'getMany') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${api}/${projectId}`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getTree') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const taskId = ctx.getNodeParameter('taskId', i) as string;
		return ctx.helpers.request({ method: 'GET', url: `${api}/${projectId}/${taskId}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'create') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			timezoneId: af.timezoneId ?? 'W. Europe Standard Time',
			noFeed: af.noFeed ?? false,
			projectId: ctx.getNodeParameter('projectId', i),
			task: [{
				title: ctx.getNodeParameter('title', i),
				description: af.description ?? null, startDate: af.startDate ?? null,
				endDate: af.endDate ?? null, plannedHours: af.plannedHours ?? null,
				responsibleUserId: af.responsibleUserId ?? null,
				parentTaskId: af.parentTaskId ?? null,
				sortOrder: af.sortOrder ?? null, externalId: af.externalId ?? null, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'update') {
		const taskId = ctx.getNodeParameter('taskId', i) as string;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const tz = uf.timezoneId ?? 'W. Europe Standard Time';
		delete uf.timezoneId;
		const body: IDataObject = { timezoneId: tz, task: [{ id: taskId, useExternalId: false, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const taskId = ctx.getNodeParameter('taskId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${taskId}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'createFromTemplate') {
		const templateId = ctx.getNodeParameter('templateId', i) as string;
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			projectId: ctx.getNodeParameter('projectId', i),
			title: af.title ?? null,
			overrideStatus: af.overrideStatus ?? false,
			overridePriority: af.overridePriority ?? false,
			overrideWorkflow: af.overrideWorkflow ?? false,
		};
		return ctx.helpers.request({ method: 'POST', url: `${api}/${templateId}`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'updateDependencies') {
		const taskId = ctx.getNodeParameter('taskId', i) as string;
		const body = JSON.parse(ctx.getNodeParameter('dependencyJson', i) as string);
		return ctx.helpers.request({ method: 'PATCH', url: `${api}/${taskId}/dependencies`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'removeDependencies') {
		const taskId = ctx.getNodeParameter('taskId', i) as string;
		const predecessorIds = (ctx.getNodeParameter('predecessorIds', i) as string).split(',').map(s => s.trim());
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${taskId}/dependencies`, headers, qs: { taskIds: predecessorIds }, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown task operation: ${op}`);
}

// ─── ABSENCE ──────────────────────────────────────────────────────────────────
async function handleAbsence(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const api = `${base}/api/integration/absence/json`;
	if (op === 'getMany') {
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: api, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'create') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			timezoneId: af.timezoneId ?? 'W. Europe Standard Time',
			absence: [{
				userId: ctx.getNodeParameter('userId', i),
				absenceTypeId: ctx.getNodeParameter('absenceTypeId', i),
				startDate: ctx.getNodeParameter('startDate', i),
				endDate: ctx.getNodeParameter('endDate', i),
				status: ctx.getNodeParameter('status', i),
				comment: af.comment ?? null, locked: af.locked ?? false,
				startDateMinutes: af.startDateMinutes ?? null, endDateMinutes: af.endDateMinutes ?? null,
				externalId: af.externalId ?? null, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'update') {
		const id = ctx.getNodeParameter('absenceId', i) as string;
		const useExt = ctx.getNodeParameter('useExternalId', i) as boolean;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const tz = uf.timezoneId ?? 'W. Europe Standard Time';
		delete uf.timezoneId;
		const body: IDataObject = { timezoneId: tz, absence: [{ id, useExternalId: useExt, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('absenceId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown absence operation: ${op}`);
}

// ─── TIME RECORD ──────────────────────────────────────────────────────────────
async function handleTimeRecord(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const api = `${base}/api/integration/timerecord/json`;
	if (op === 'getMany') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${api}/${projectId}`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'create') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			timezoneId: af.timezoneId ?? 'W. Europe Standard Time',
			projectId: ctx.getNodeParameter('projectId', i),
			timeRecord: [{
				taskId: ctx.getNodeParameter('taskId', i),
				userId: ctx.getNodeParameter('userId', i),
				date: ctx.getNodeParameter('date', i),
				duration: af.duration ?? null,
				startDate: af.startDate ?? null, endDate: af.endDate ?? null,
				statusId: af.statusId ?? 0,
				externalId: af.externalId ?? null, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'update') {
		const id = ctx.getNodeParameter('timeRecordId', i) as string;
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const useExt = ctx.getNodeParameter('useExternalId', i) as boolean;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const tz = uf.timezoneId ?? 'W. Europe Standard Time';
		delete uf.timezoneId;
		const body: IDataObject = { timezoneId: tz, projectId, timeRecord: [{ id, useExternalId: useExt, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('timeRecordId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown timeRecord operation: ${op}`);
}

// ─── STATUS REPORT ────────────────────────────────────────────────────────────
async function handleStatusReport(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const api = `${base}/api/integration/statusreport/json`;
	if (op === 'create') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			timezoneId: af.timezoneId ?? 'W. Europe Standard Time',
			noFeed: af.noFeed ?? false,
			projectId: ctx.getNodeParameter('projectId', i),
			statusReport: [{
				title: ctx.getNodeParameter('title', i),
				statusDate: ctx.getNodeParameter('statusDate', i),
				overallStatusId: ctx.getNodeParameter('overallStatusId', i),
				explanation: af.explanation ?? null, nextSteps: af.nextSteps ?? null,
				targetDate: af.targetDate ?? null, timeStatusId: af.timeStatusId ?? null,
				costStatusId: af.costStatusId ?? null, goalStatusId: af.goalStatusId ?? null,
				progressManual: af.progressManual ?? null, isPublished: af.isPublished ?? false,
				externalId: af.externalId ?? null, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'createFromTemplate') {
		const templateId = ctx.getNodeParameter('templateId', i) as string;
		const body: IDataObject = {
			projectId: ctx.getNodeParameter('projectId', i),
			title: ctx.getNodeParameter('title', i),
			progressManual: ctx.getNodeParameter('progressManual', i),
		};
		return ctx.helpers.request({ method: 'POST', url: `${api}/${templateId}`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'update') {
		const id = ctx.getNodeParameter('statusReportId', i) as string;
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const useExt = ctx.getNodeParameter('useExternalId', i) as boolean;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const tz = uf.timezoneId ?? 'W. Europe Standard Time';
		delete uf.timezoneId;
		const body: IDataObject = { timezoneId: tz, projectId, statusReport: [{ id, useExternalId: useExt, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('statusReportId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown statusReport operation: ${op}`);
}

// ─── COMMENT ──────────────────────────────────────────────────────────────────
async function handleComment(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	if (op === 'get') {
		const id = ctx.getNodeParameter('commentId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/comment/json/${id}`, headers, qs: f, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('commentId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/comment/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'getManyTask') {
		const taskId = ctx.getNodeParameter('taskId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/comment/task/json/${taskId}`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getManyStatusReport') {
		const id = ctx.getNodeParameter('statusReportId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/comment/statusreport/json/${id}`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'createTask') {
		const body: IDataObject = { comment: [{ taskId: ctx.getNodeParameter('taskId', i), text: ctx.getNodeParameter('text', i), isInternal: ctx.getNodeParameter('isInternal', i, false), tempId: null }] };
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/comment/task/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'createStatusReport') {
		const body: IDataObject = { comment: [{ statusReportId: ctx.getNodeParameter('statusReportId', i), text: ctx.getNodeParameter('text', i), isInternal: ctx.getNodeParameter('isInternal', i, false), tempId: null }] };
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/comment/statusreport/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'updateTask') {
		const body: IDataObject = { comment: [{ id: ctx.getNodeParameter('commentId', i), text: ctx.getNodeParameter('text', i), isInternal: ctx.getNodeParameter('isInternal', i, false) }] };
		return ctx.helpers.request({ method: 'PUT', url: `${base}/api/integration/comment/task/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'updateStatusReport') {
		const body: IDataObject = { comment: [{ id: ctx.getNodeParameter('commentId', i), text: ctx.getNodeParameter('text', i), isInternal: ctx.getNodeParameter('isInternal', i, false) }] };
		return ctx.helpers.request({ method: 'PUT', url: `${base}/api/integration/comment/statusreport/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown comment operation: ${op}`);
}

// ─── FOLDER ───────────────────────────────────────────────────────────────────
async function handleFolder(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const api = `${base}/api/integration/folders/json`;
	if (op === 'getMany') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${api}/${projectId}`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'create') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const tz = af.timezoneId ?? 'W. Europe Standard Time';
		delete af.timezoneId;
		const body: IDataObject = {
			timezoneId: tz, projectId,
			folder: [{ name: ctx.getNodeParameter('name', i), ...af, tempId: null }],
		};
		return ctx.helpers.request({ method: 'POST', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'update') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const folderId = ctx.getNodeParameter('folderId', i) as string;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = {
			timezoneId: 'W. Europe Standard Time', projectId,
			folder: [{ id: folderId, ...uf }],
		};
		return ctx.helpers.request({ method: 'PUT', url: api, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const folderId = ctx.getNodeParameter('folderId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${api}/${projectId}/${folderId}`, headers, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown folder operation: ${op}`);
}

// ─── ATTACHMENT ───────────────────────────────────────────────────────────────
async function handleAttachment(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	if (op === 'download') {
		const id = ctx.getNodeParameter('attachmentId', i) as string;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/attachment/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('attachmentId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/attachment/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'getProject') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		const projectOnly = ctx.getNodeParameter('projectOnly', i) as boolean;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/attachment/project/json/${id}`, headers, qs: { projectOnly }, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getTask') {
		const id = ctx.getNodeParameter('taskId', i) as string;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/attachment/task/json/${id}`, headers, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getStatusReport') {
		const id = ctx.getNodeParameter('statusReportId', i) as string;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/attachment/statusreport/json/${id}`, headers, json: true }) as Promise<IDataObject[]>;
	}
	throw new Error(`Unknown attachment operation: ${op}`);
}

// ─── FLAVOR ───────────────────────────────────────────────────────────────────
async function handleFlavor(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	if (op === 'getMany') {
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/flavor/json`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'delete') {
		const id = ctx.getNodeParameter('flavorId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/flavor/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown flavor operation: ${op}`);
}

// ─── PERMISSIONS ──────────────────────────────────────────────────────────────
async function handlePermissions(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const accessBody = (ctx: IExecuteFunctions, i: number) => ({
		add: { users: ctx.getNodeParameter('addUsers', i, '') as string || undefined, teams: ctx.getNodeParameter('addTeams', i, '') as string || undefined },
		remove: { users: ctx.getNodeParameter('removeUsers', i, '') as string || undefined, teams: ctx.getNodeParameter('removeTeams', i, '') as string || undefined },
	});
	if (op === 'getProject') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/permissions/project/json/${id}`, headers, qs: f, json: true }) as Promise<IDataObject>;
	}
	if (op === 'setProjectAccess') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/permissions/project/access/json/${id}`, headers, body: accessBody(ctx, i), json: true }) as Promise<IDataObject>;
	}
	if (op === 'deleteProjectAccess') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/permissions/project/access/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'setProjectPrivacy') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/permissions/project/private/json/${id}`, headers, body: accessBody(ctx, i), json: true }) as Promise<IDataObject>;
	}
	if (op === 'deleteProjectPrivacy') {
		const id = ctx.getNodeParameter('projectId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/permissions/project/private/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'getTask') {
		const id = ctx.getNodeParameter('taskId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/permissions/task/json/${id}`, headers, qs: f, json: true }) as Promise<IDataObject>;
	}
	if (op === 'setTaskAccess') {
		const id = ctx.getNodeParameter('taskId', i) as string;
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/permissions/task/access/json/${id}`, headers, body: accessBody(ctx, i), json: true }) as Promise<IDataObject>;
	}
	if (op === 'deleteTaskAccess') {
		const id = ctx.getNodeParameter('taskId', i) as string;
		const includeSubtasks = ctx.getNodeParameter('includeSubtasks', i, true) as boolean;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/permissions/task/access/json/${id}`, headers, qs: { includeSubtasks }, json: true }) as Promise<IDataObject>;
	}
	if (op === 'setTaskPrivacy') {
		const id = ctx.getNodeParameter('taskId', i) as string;
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/permissions/task/private/json/${id}`, headers, body: accessBody(ctx, i), json: true }) as Promise<IDataObject>;
	}
	if (op === 'deleteTaskPrivacy') {
		const id = ctx.getNodeParameter('taskId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/permissions/task/private/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown permissions operation: ${op}`);
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
async function handleSettings(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	if (op === 'getTimezones') {
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/timezones/json`, headers, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getStatusTicket') {
		const id = ctx.getNodeParameter('ticketId', i) as string;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/status/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'getMembers') {
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/settings/member/json`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'updateMember') {
		const id = ctx.getNodeParameter('memberId', i) as string;
		const flavors = JSON.parse(ctx.getNodeParameter('flavorJson', i) as string);
		const body: IDataObject = { timezoneId: 'W. Europe Standard Time', member: [{ id, flavor: flavors }] };
		return ctx.helpers.request({ method: 'PUT', url: `${base}/api/integration/settings/member/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'getAbsenceTypes') {
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/settings/absencetypes/json`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getAbsenceType') {
		const id = ctx.getNodeParameter('absenceTypeId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/settings/absencetype/json/${id}`, headers, qs: f, json: true }) as Promise<IDataObject>;
	}
	if (op === 'createAbsenceType') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			absenceType: [{
				title: ctx.getNodeParameter('title', i),
				type: ctx.getNodeParameter('absenceTypeLimitType', i),
				isApprovalNecessary: af.isApprovalNecessary ?? false,
				includeInHolidaysOverview: af.includeInHolidaysOverview ?? true,
				yearlyBudget: af.yearlyBudget ?? null,
				recommendedApprovers: af.recommendedApprovers ?? null,
				externalId: af.externalId ?? null, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/settings/absencetype/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'updateAbsenceType') {
		const id = ctx.getNodeParameter('absenceTypeId', i) as string;
		const useExt = ctx.getNodeParameter('useExternalId', i, false) as boolean;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { absenceType: [{ id, useExternalId: useExt, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: `${base}/api/integration/settings/absencetype/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'deleteAbsenceType') {
		const id = ctx.getNodeParameter('absenceTypeId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/settings/absencetype/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'getAllWorkingTimes') {
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/settings/member/workingtime/json`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'getUserWorkingTimes') {
		const userId = ctx.getNodeParameter('userId', i) as string;
		const f = ctx.getNodeParameter('filters', i, {}) as IDataObject;
		return ctx.helpers.request({ method: 'GET', url: `${base}/api/integration/settings/member/workingtime/json/${userId}`, headers, qs: f, json: true }) as Promise<IDataObject[]>;
	}
	if (op === 'createWorkingTime') {
		const af = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const tz = af.timezoneId ?? 'W. Europe Standard Time';
		delete af.timezoneId;
		const body: IDataObject = {
			timezoneId: tz,
			memberWorkingTime: [{
				userId: ctx.getNodeParameter('userId', i),
				startDate: ctx.getNodeParameter('startDate', i),
				...af, tempId: null,
			}],
		};
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/settings/member/workingtime/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'updateWorkingTime') {
		const id = ctx.getNodeParameter('dailyCapacityId', i) as string;
		const uf = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const tz = uf.timezoneId ?? 'W. Europe Standard Time';
		const useExt = uf.useExternalId ?? false;
		delete uf.timezoneId; delete uf.useExternalId;
		const body: IDataObject = { timezoneId: tz, memberWorkingTime: [{ id, useExternalId: useExt, ...uf }] };
		return ctx.helpers.request({ method: 'PUT', url: `${base}/api/integration/settings/member/workingtime/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'deleteWorkingTime') {
		const id = ctx.getNodeParameter('dailyCapacityId', i) as string;
		return ctx.helpers.request({ method: 'DELETE', url: `${base}/api/integration/settings/member/workingtime/json/${id}`, headers, json: true }) as Promise<IDataObject>;
	}
	if (op === 'inviteMembers') {
		const body: IDataObject = {
			invites: [{ email: ctx.getNodeParameter('email', i), role: ctx.getNodeParameter('role', i), locale: ctx.getNodeParameter('locale', i, 'de') }],
		};
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/workspace/invite/members/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	if (op === 'inviteGuests') {
		const body: IDataObject = {
			invites: [{ email: ctx.getNodeParameter('email', i), role: ctx.getNodeParameter('role', i), locale: ctx.getNodeParameter('locale', i, 'de') }],
		};
		return ctx.helpers.request({ method: 'POST', url: `${base}/api/integration/workspace/invite/guests/json`, headers, body, json: true }) as Promise<IDataObject>;
	}
	throw new Error(`Unknown settings operation: ${op}`);
}

// ─── REPORTING ────────────────────────────────────────────────────────────────
async function handleReporting(ctx: IExecuteFunctions, i: number, base: string, headers: IDataObject, op: string): Promise<IDataObject | IDataObject[]> {
	const rBase = `${base}/api/reports`;
	const lang = ctx.getNodeParameter('lang', i, 'de-DE') as string;
	const format = ctx.getNodeParameter('format', i, 'JSON') as string;
	const timezone = ctx.getNodeParameter('timezone', i, 'Europe/Berlin') as string;
	const rHeaders = { ...headers, timezone };

	if (op === 'getProjects') {
		const view = ctx.getNodeParameter('view', i, '') as string;
		const filter = ctx.getNodeParameter('globalProjectsFilter', i, 'active') as string;
		const hdrs = ctx.getNodeParameter('headers', i, '') as string;
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/projects`, headers: rHeaders, qs: { view, filter, lang, headers: hdrs, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getProject') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const view = ctx.getNodeParameter('view', i, '') as string;
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/projects/${projectId}`, headers: rHeaders, qs: { view, lang, format }, json: format === 'JSON' }) as Promise<IDataObject>;
	}
	if (op === 'getTasks') {
		const projectId = ctx.getNodeParameter('projectId', i) as string;
		const view = ctx.getNodeParameter('view', i, '') as string;
		const hdrs = ctx.getNodeParameter('headers', i, '') as string;
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/tasks/${projectId}`, headers: rHeaders, qs: { view, lang, headers: hdrs, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getTasksFiltered') {
		const filter = ctx.getNodeParameter('globalProjectsFilter', i, 'all') as string;
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/tasks/filtered`, headers: rHeaders, qs: { lang, format, globalProjectsFilter: filter }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getTimeRecords') {
		const mode = ctx.getNodeParameter('mode', i, 'all') as string;
		const filter = ctx.getNodeParameter('filter', i, '') as string;
		const view = ctx.getNodeParameter('view', i, '') as string;
		const hdrs = ctx.getNodeParameter('headers', i, '') as string;
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/times/${mode}`, headers: rHeaders, qs: { filter, view, lang, headers: hdrs, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getAbsences') {
		const mode = ctx.getNodeParameter('mode', i, 'all') as string;
		const filter = ctx.getNodeParameter('filter', i, '') as string;
		const hdrs = ctx.getNodeParameter('headers', i, '') as string;
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/absences/${mode}`, headers: rHeaders, qs: { filter, lang, headers: hdrs, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getTeams') {
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/teams`, headers: rHeaders, qs: { lang, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getFlavors') {
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/flavors`, headers: rHeaders, qs: { lang, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	if (op === 'getMemberSettings') {
		return ctx.helpers.request({ method: 'GET', url: `${rBase}/settings/member`, headers: rHeaders, qs: { lang, format }, json: format === 'JSON' }) as Promise<IDataObject[]>;
	}
	throw new Error(`Unknown reporting operation: ${op}`);
}

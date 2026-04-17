import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
} from 'n8n-workflow';

import { projectFields, projectOperations } from './ProjectDescription';
import { taskFields, taskOperations } from './TaskDescription';

export class Smenso implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'smenso',
    name: 'smenso',
    icon: 'file:smenso.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the smenso project management API',
    defaults: {
      name: 'smenso',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'smensoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Task',
            value: 'task',
          },
        ],
        default: 'project',
      },
      ...projectOperations,
      ...projectFields,
      ...taskOperations,
      ...taskFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('smensoApi');

    const baseUrl = `https://${credentials.workspace}.smenso.cloud/skyisland/api`;
    const headers = {
      Authorization: `Basic ${credentials.apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: unknown;

        if (resource === 'project') {
          responseData = await handleProject(this, i, baseUrl, headers, operation);
        } else if (resource === 'task') {
          responseData = await handleTask(this, i, baseUrl, headers, operation);
        }

        const executionData = this.helpers.constructExecutionMetaData(
         this.helpers.returnJsonArray(responseData as IDataObject[]),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
         returnData.push({ json: { error: (error as Error).message } as IDataObject, pairedItem: { item: i } });
          continue;
        }
        throw new NodeApiError(this.getNode(), error as object);
      }
    }

    return [returnData];
  }
}

async function handleProject(
  context: IExecuteFunctions,
  i: number,
  baseUrl: string,
  headers: Record<string, string>,
  operation: string,
): Promise<unknown> {
  if (operation === 'getMany') {
    const response = await context.helpers.request({
      method: 'GET',
      url: `${baseUrl}/integration/project/json`,
      headers,
      json: true,
    });
    return response;
  }

  if (operation === 'get') {
    const projectId = context.getNodeParameter('projectId', i) as string;
    const response = await context.helpers.request({
      method: 'GET',
      url: `${baseUrl}/integration/project/json/${projectId}`,
      headers,
      json: true,
    });
    return response;
  }

  if (operation === 'create') {
    const title = context.getNodeParameter('title', i) as string;
    const phaseId = context.getNodeParameter('phaseId', i) as string;
    const typeId = context.getNodeParameter('typeId', i) as string;
    const additionalFields = context.getNodeParameter('additionalFields', i) as Record<string, unknown>;

    const body = {
      timezoneId: (additionalFields.timezoneId as string) ?? 'W. Europe Standard Time',
      externalIdReference: null,
      project: [
        {
          title,
          phaseId,
          typeId,
          description: additionalFields.description ?? null,
          goal: additionalFields.goal ?? null,
          startDate: additionalFields.startDate ?? null,
          endDate: additionalFields.endDate ?? null,
          budget: additionalFields.budget ?? null,
          currency: additionalFields.currency ?? null,
          externalId: null,
          tempId: null,
        },
      ],
    };

    const response = await context.helpers.request({
      method: 'POST',
      url: `${baseUrl}/integration/project/json`,
      headers,
      body,
      json: true,
    });
    return response;
  }

  if (operation === 'update') {
    const projectId = context.getNodeParameter('projectId', i) as string;
    const updateFields = context.getNodeParameter('updateFields', i) as Record<string, unknown>;

    const body = {
      timezoneId: 'W. Europe Standard Time',
      project: [
        {
          id: projectId,
          ...updateFields,
        },
      ],
    };

    const response = await context.helpers.request({
      method: 'PUT',
      url: `${baseUrl}/integration/project/json`,
      headers,
      body,
      json: true,
    });
    return response;
  }

  if (operation === 'delete') {
    const projectId = context.getNodeParameter('projectId', i) as string;
    const response = await context.helpers.request({
      method: 'DELETE',
      url: `${baseUrl}/integration/project/json/${projectId}`,
      headers,
      json: true,
    });
    return response;
  }

  if (operation === 'archive') {
    const projectId = context.getNodeParameter('projectId', i) as string;
    const response = await context.helpers.request({
      method: 'POST',
      url: `${baseUrl}/integration/project/json/${projectId}/archive`,
      headers,
      json: true,
    });
    return response;
  }

  throw new Error(`Unknown operation: ${operation}`);
}

async function handleTask(
  context: IExecuteFunctions,
  i: number,
  baseUrl: string,
  headers: Record<string, string>,
  operation: string,
): Promise<unknown> {
  if (operation === 'getMany') {
    const projectId = context.getNodeParameter('projectId', i) as string;
    const response = await context.helpers.request({
      method: 'GET',
      url: `${baseUrl}/integration/task/json`,
      headers,
      qs: { projectId },
      json: true,
    });
    return response;
  }

  if (operation === 'getTree') {
    const taskId = context.getNodeParameter('taskId', i) as string;
    const response = await context.helpers.request({
      method: 'GET',
      url: `${baseUrl}/integration/task/json/${taskId}/tree`,
      headers,
      json: true,
    });
    return response;
  }

  if (operation === 'create') {
    const projectId = context.getNodeParameter('projectId', i) as string;
    const title = context.getNodeParameter('title', i) as string;
    const additionalFields = context.getNodeParameter('additionalFields', i) as Record<string, unknown>;

    const body = {
      timezoneId: (additionalFields.timezoneId as string) ?? 'W. Europe Standard Time',
      projectId,
      task: [
        {
          title,
          description: additionalFields.description ?? null,
          startDate: additionalFields.startDate ?? null,
          endDate: additionalFields.endDate ?? null,
          plannedHours: additionalFields.plannedHours ?? null,
          responsibleUserId: additionalFields.responsibleUserId ?? null,
          parentTaskId: additionalFields.parentTaskId ?? null,
          sortOrder: additionalFields.sortOrder ?? null,
          externalId: null,
          tempId: null,
        },
      ],
    };

    const response = await context.helpers.request({
      method: 'POST',
      url: `${baseUrl}/integration/task/json`,
      headers,
      body,
      json: true,
    });
    return response;
  }

  if (operation === 'update') {
    const taskId = context.getNodeParameter('taskId', i) as string;
    const updateFields = context.getNodeParameter('updateFields', i) as Record<string, unknown>;

    const body = {
      timezoneId: 'W. Europe Standard Time',
      task: [
        {
          id: taskId,
          ...updateFields,
        },
      ],
    };

    const response = await context.helpers.request({
      method: 'PUT',
      url: `${baseUrl}/integration/task/json`,
      headers,
      body,
      json: true,
    });
    return response;
  }

  if (operation === 'delete') {
    const taskId = context.getNodeParameter('taskId', i) as string;
    const response = await context.helpers.request({
      method: 'DELETE',
      url: `${baseUrl}/integration/task/json/${taskId}`,
      headers,
      json: true,
    });
    return response;
  }

  throw new Error(`Unknown operation: ${operation}`);
}

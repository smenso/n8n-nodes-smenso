import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: { resource: ['task'] },
    },
    options: [
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Retrieve tasks for a project',
        action: 'Get many tasks',
      },
      {
        name: 'Get Tree',
        value: 'getTree',
        description: 'Retrieve a task with all its subtasks',
        action: 'Get task tree',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new task',
        action: 'Create a task',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an existing task',
        action: 'Update a task',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a task',
        action: 'Delete a task',
      },
    ],
    default: 'getMany',
  },
];

export const taskFields: INodeProperties[] = [
  // ─── Project ID (shared by most operations) ────────────────────────────────
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['getMany', 'create'],
      },
    },
    description: 'The GUID of the project this task belongs to',
  },

  // ─── Task ID ───────────────────────────────────────────────────────────────
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['getTree', 'update', 'delete'],
      },
    },
    description: 'The GUID of the task',
  },

  // ─── Create ────────────────────────────────────────────────────────────────
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: { resource: ['task'], operation: ['create'] },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: { resource: ['task'], operation: ['create'] },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Planned Hours',
        name: 'plannedHours',
        type: 'number',
        default: 0,
      },
      {
        displayName: 'Responsible User ID',
        name: 'responsibleUserId',
        type: 'string',
        default: '',
        description: 'GUID of the user responsible for this task',
      },
      {
        displayName: 'Parent Task ID',
        name: 'parentTaskId',
        type: 'string',
        default: '',
        description: 'GUID of the parent task (for creating subtasks)',
      },
      {
        displayName: 'Sort Order',
        name: 'sortOrder',
        type: 'number',
        default: 0,
      },
      {
        displayName: 'Timezone ID',
        name: 'timezoneId',
        type: 'string',
        default: 'W. Europe Standard Time',
      },
    ],
  },

  // ─── Update ────────────────────────────────────────────────────────────────
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: { resource: ['task'], operation: ['update'] },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Planned Hours',
        name: 'plannedHours',
        type: 'number',
        default: 0,
      },
      {
        displayName: 'Responsible User ID',
        name: 'responsibleUserId',
        type: 'string',
        default: '',
      },
    ],
  },
];

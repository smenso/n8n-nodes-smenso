import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: { resource: ['project'] },
    },
    options: [
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Retrieve a list of projects',
        action: 'Get many projects',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single project by ID',
        action: 'Get a project',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new project',
        action: 'Create a project',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an existing project',
        action: 'Update a project',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a project',
        action: 'Delete a project',
      },
      {
        name: 'Archive',
        value: 'archive',
        description: 'Archive a project',
        action: 'Archive a project',
      },
    ],
    default: 'getMany',
  },
];

export const projectFields: INodeProperties[] = [
  // ─── Get / Delete / Archive ────────────────────────────────────────────────
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['get', 'update', 'delete', 'archive'],
      },
    },
    description: 'The GUID of the project',
  },

  // ─── Create ────────────────────────────────────────────────────────────────
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: { resource: ['project'], operation: ['create'] },
    },
  },
  {
    displayName: 'Phase ID (Project Folder)',
    name: 'phaseId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: { resource: ['project'], operation: ['create'] },
    },
    description: 'Project Folder value from project master data',
  },
  {
    displayName: 'Type ID (Project Type)',
    name: 'typeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: { resource: ['project'], operation: ['create'] },
    },
    description: 'Project Type value from project master data',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: { resource: ['project'], operation: ['create'] },
    },
    options: [
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
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
      },
      {
        displayName: 'Goal',
        name: 'goal',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
      },
      {
        displayName: 'Budget',
        name: 'budget',
        type: 'number',
        default: 0,
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: 'EUR',
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
      show: { resource: ['project'], operation: ['update'] },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
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
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
      },
      {
        displayName: 'Goal',
        name: 'goal',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
      },
      {
        displayName: 'Budget',
        name: 'budget',
        type: 'number',
        default: 0,
      },
    ],
  },
];

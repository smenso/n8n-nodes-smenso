import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SmensoApi implements ICredentialType {
  name = 'smensoApi';
  displayName = 'Smenso API';
  documentationUrl = 'https://developers.smenso.de/docs/authentication';
  icon = 'file:smenso.svg' as const;

  properties: INodeProperties[] = [
    {
      displayName: 'Workspace',
      name: 'workspace',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'mycompany',
      description: 'Your smenso workspace subdomain (e.g. "mycompany" from mycompany.smenso.cloud)',
    },
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Personal API token generated in the smenso Admin Center (admin.smenso.cloud)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Basic {{$credentials.apiToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '=https://{{$credentials.workspace}}.smenso.cloud/skyisland/api',
      url: '/integration/timezones/json',
      method: 'GET',
    },
  };
}

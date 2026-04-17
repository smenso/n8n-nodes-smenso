# n8n-nodes-smenso

Official n8n community node for [smenso](https://smenso.de) – the project management platform for teams.

## Features

Automate your smenso workspace directly from n8n workflows:

- **Projects** – Get, create, update, delete, archive
- **Tasks** – Get, get tree (with subtasks), create, update, delete

## Installation

In your self-hosted n8n instance: **Settings → Community Nodes → Install** and enter `n8n-nodes-smenso`.

## Authentication

1. Open the [smenso Admin Center](https://admin.smenso.cloud)
2. Navigate to **API Token** and create a new token
3. In n8n, create a new **smenso API** credential and enter your workspace subdomain and token

> The smenso Integration API requires the **Enterprise Add-on "smenso Integration API"** to be enabled on your workspace.

## Resources

- [smenso API Documentation](https://developers.smenso.de)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT

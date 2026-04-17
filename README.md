# n8n-nodes-smenso

Official n8n community node for [smenso](https://smenso.de) – the project management platform for teams.

---

## Prerequisites

Before you can use this node, your smenso workspace needs the **Enterprise Add-on "smenso Integration API"** enabled. Contact your smenso account manager if you're unsure whether this is active.

---

## Installation

In your self-hosted n8n instance:

1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-smenso`
4. Confirm the installation

---

## Authentication

This node uses a personal API token from the smenso Admin Center.

### Step 1 — Generate an API Token

1. Open [admin.smenso.cloud](https://admin.smenso.cloud)
2. Navigate to **API Token**
3. Click **Create API Token**
4. Select the workspace and set a validity period
5. Give the token a name (e.g. `n8n integration`)
6. Click **Create**
7. **Copy the token immediately** — it is only shown once

### Step 2 — Find your Workspace Subdomain

Your workspace subdomain is the part before `.smenso.cloud` in your smenso URL.

> Example: if your URL is `mycompany.smenso.cloud`, your subdomain is `mycompany`

### Step 3 — Set up the Credential in n8n

1. In n8n, open any workflow and add the **smenso** node
2. Click **Credential for smenso API → Create New**
3. Enter your **Workspace** subdomain (e.g. `mycompany`)
4. Paste your **API Token**
5. Click **Save** — n8n will verify the connection automatically

---

## What this node can do

### Resource: Project

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all projects in your workspace |
| **Get** | Retrieve a single project by its ID |
| **Create** | Create a new project |
| **Update** | Update an existing project's fields |
| **Delete** | Permanently delete a project |
| **Archive** | Archive a project |

### Resource: Task

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all tasks for a project |
| **Get Tree** | Retrieve a task including all its subtasks |
| **Create** | Create a new task in a project |
| **Update** | Update an existing task |
| **Delete** | Permanently delete a task |

---

## Example Use Cases

**Automatically create a smenso task from a form submission**
Trigger: Typeform / Webflow / Elementor form → smenso node (Create Task)

**Daily project status summary via email**
Trigger: Schedule → smenso node (Get Many Projects) → Gmail node

**Sync new CRM deals to smenso projects**
Trigger: HubSpot / Pipedrive → smenso node (Create Project)

**Create tasks from incoming emails**
Trigger: Gmail / Outlook → smenso node (Create Task)

---

## Finding IDs

Most operations require a **Project ID** or **Task ID**. These are GUIDs you can find in the smenso URL when viewing a project or task, or by first running a **Get Many** operation and copying the `id` field from the output.

---

## Important Notes

- **Write operations** (Create, Update, Delete, Archive) require your API token to belong to a user with **Admin role** in smenso
- **Read operations** (Get, Get Many) work with any user role
- The smenso API processes some operations asynchronously — if you receive a `202` response, the operation was accepted and is being processed

---

## Resources

- [smenso API Documentation](https://developers.smenso.de)
- [smenso Help Center](https://help.smenso.de)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

---

## License

MIT

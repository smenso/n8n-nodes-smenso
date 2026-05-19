# n8n-nodes-smenso

Official n8n community node for [smenso](https://smenso.de) – the project management platform for teams and enterprises.

This node gives you full access to the smenso API directly from your n8n workflows: manage projects, tasks, time records, absences, status reports, permissions, and much more — without writing a single line of code.

---

## Prerequisites

Before you can use this node, your smenso workspace needs the **Enterprise Add-on "smenso Integration API"** enabled. Contact your smenso account manager if you're unsure whether this is active.

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

## Important: Async Operations & Ticket Polling

Many write operations in smenso are **asynchronous**. Instead of returning the created/updated record immediately, the API returns a **Ticket ID**. Use the **Settings / Utilities → Get Status Ticket** operation to poll for the result.

Ticket status values:

| Status | Meaning |
|---|---|
| `Started` | Still processing — poll again after a short wait |
| `Success` | Operation completed successfully |
| `Success with Errors` | Partially completed — check details |
| `Failed` | Operation failed — check error details |

**Tip:** Add a **Wait** node (2–3 seconds) between the write operation and the ticket poll.

---

## What this node can do

### Resource: Project

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all projects in the workspace. Optional filters: Project IDs, Language, Timezone, View ID. |
| **Get** | Retrieve a single project by its GUID. |
| **Create** | Create a new project (async). Required: Title, Phase ID, Type ID. |
| **Update** | Update an existing project (async). Required: Project ID. |
| **Delete** | Permanently delete a project. |
| **Archive** | Archive a project (async). |
| **Unarchive** | Restore an archived project (async). |
| **Create From Template** | Create a new project based on a template. Required: Template ID, Title, Folder, Project Type. |
| **Update Master Data From Template** | Apply template master data to an existing project. Required: Template ID, Project ID. |

---

### Resource: Task

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all tasks for a project. Required: Project ID. |
| **Get Tree** | Retrieve a task together with all its subtasks. Required: Project ID, Task ID. |
| **Create** | Create one or more tasks (async). Required: Project ID, Title. |
| **Update** | Update an existing task (async). Required: Task ID. |
| **Delete** | Permanently delete a task. Required: Task ID. |
| **Create From Template** | Create a task from a task template. Required: Template ID, Project ID. |
| **Update Dependencies** | Add or modify predecessor dependencies (PATCH). Required: Project ID, Task ID, dependencies JSON array. |
| **Remove Dependencies** | Remove predecessor dependencies. Required: Project ID, Task ID, predecessor Task IDs. |

---

### Resource: Absence

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all absences in the workspace. Optional: Language, Timezone. |
| **Create** | Create one or more absences (async). Required: User ID/Email, Absence Type ID/Name, Start Date, End Date, Status. |
| **Update** | Update an existing absence (async). Required: Absence ID. Supports External ID lookup. |
| **Delete** | Permanently delete an absence. Required: Absence ID. |

---

### Resource: Time Record

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all time records for a project. Required: Project ID. |
| **Create** | Create one or more time records (async). Required: Project ID, Task ID, User ID/Email, Date. |
| **Update** | Update an existing time record (async). Required: Time Record ID, Project ID. Supports External ID lookup. |
| **Delete** | Permanently delete a time record. Required: Time Record ID. |

---

### Resource: Status Report

| Operation | Description |
|---|---|
| **Create** | Create a new status report (async). Required: Project ID, Title, Status Date, Overall Status ID (1–7). |
| **Update** | Update an existing status report (async). Required: Status Report ID, Project ID. |
| **Delete** | Permanently delete a status report. Required: Status Report ID. |
| **Create From Template** | Create a status report from a template. Required: Template ID, Project ID, Title, Progress (0–100). |

---

### Resource: Comment

| Operation | Description |
|---|---|
| **Get** | Retrieve a single comment by its ID. |
| **Get Many (Task)** | Retrieve all comments for a task. Required: Task ID. |
| **Get Many (Status Report)** | Retrieve all comments for a status report. Required: Status Report ID. |
| **Create (Task)** | Create a comment on a task (async). Required: Task ID, Text. |
| **Create (Status Report)** | Create a comment on a status report (async). Required: Status Report ID, Text. |
| **Update (Task)** | Update a task comment (async). Required: Comment ID, Text. |
| **Update (Status Report)** | Update a status report comment (async). Required: Comment ID, Text. |
| **Delete** | Permanently delete a comment. Required: Comment ID. |

---

### Resource: Folder

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all folders for a project. Required: Project ID. |
| **Create** | Create one or more folders in a project (async). Required: Project ID, Name. |
| **Update** | Update an existing folder (async). Required: Project ID, Folder ID. |
| **Delete** | Permanently delete a folder. Required: Project ID, Folder ID. |

---

### Resource: Attachment

| Operation | Description |
|---|---|
| **Download** | Download an attachment by ID. Required: Attachment ID. |
| **Delete** | Permanently delete an attachment. Required: Attachment ID. |
| **Get Project Attachments** | List all attachments for a project. Required: Project ID. |
| **Get Task Attachments** | List all attachments for a task. Required: Task ID. |
| **Get Status Report Attachments** | List all attachments for a status report. Required: Status Report ID. |

---

### Resource: Flavor

Flavors are smenso's custom fields — configurable additional data fields on projects, tasks, and time records.

| Operation | Description |
|---|---|
| **Get Many** | Retrieve all flavor definitions in the workspace. |
| **Delete** | Permanently delete a flavor definition. Required: Flavor ID. |

---

### Resource: Permissions

| Operation | Description |
|---|---|
| **Get Project Permissions** | Retrieve access and privacy settings for a project. Required: Project ID. |
| **Set Project Access** | Add or remove access restrictions for a project. Required: Project ID. |
| **Delete Project Access** | Remove all access restrictions from a project. Required: Project ID. |
| **Set Project Privacy** | Set a project as private with specific user/team access. Required: Project ID. |
| **Delete Project Privacy** | Remove privacy restrictions from a project. Required: Project ID. |
| **Get Task Permissions** | Retrieve access and privacy settings for a task. Required: Task ID. |
| **Set Task Access** | Add or remove access restrictions on a task. Required: Task ID. |
| **Delete Task Access** | Remove all access restrictions from a task. Required: Task ID. |
| **Set Task Privacy** | Set a task as private with specific user/team access. Required: Task ID. |
| **Delete Task Privacy** | Remove privacy restrictions from a task. Required: Task ID. |

---

### Resource: Settings / Utilities

#### Utilities

| Operation | Description |
|---|---|
| **Get Timezones** | Retrieve all supported timezone identifiers for use in other operations. |
| **Get Status Ticket** | Poll the processing result of any async operation. Required: Ticket ID. |

#### Members

| Operation | Description |
|---|---|
| **Get Members** | Retrieve member settings for all workspace members. |
| **Update Member** | Update flavor values for a specific member (async). Required: Member ID/Email, Flavors JSON. |

#### Absence Types

| Operation | Description |
|---|---|
| **Get Absence Types** | Retrieve all absence type definitions. |
| **Get Absence Type** | Retrieve a single absence type by ID. Required: Absence Type ID. |
| **Create Absence Types** | Create one or more absence type definitions (async). Required: Title, Type (limited/unlimited). |
| **Update Absence Types** | Update an absence type definition (async). Required: Absence Type ID. |
| **Delete Absence Type** | Permanently delete an absence type. Required: Absence Type ID. |

#### Working Times

| Operation | Description |
|---|---|
| **Get Working Times (All)** | Retrieve working time records for all workspace members. |
| **Get Working Times (User)** | Retrieve working time records for a specific user. Required: User ID/Email. |
| **Create Working Times** | Create a working time record for a user (async). Required: User ID/Email, Start Date. |
| **Update Working Times** | Update a working time record (async). Required: Daily Capacity ID. |
| **Delete Working Time** | Delete a working time record. Required: Daily Capacity ID. |

#### Workspace Invitations

| Operation | Description |
|---|---|
| **Invite Members** | Send an invitation to a new workspace member. Required: Email, Role. |
| **Invite Guests** | Send an invitation to a guest. Required: Email, Role. |

---

### Resource: Reporting (Export)

Uses the smenso Reporting API. Supports JSON and CSV output. Timezone uses IANA format (e.g. `Europe/Berlin`).

| Operation | Description |
|---|---|
| **Get Projects** | Export all visible projects. Optional: View ID, Project Filter, Column Headers, Format. |
| **Get Project** | Export a single project report. Required: Project ID. |
| **Get Tasks for Project** | Export all tasks for a specific project. Required: Project ID. |
| **Get Tasks by Filter** | Export tasks across all projects by filter. Optional: Project Filter. |
| **Get Time Records** | Export time records. Required: Mode (all/my). |
| **Get Absences** | Export absence records. Required: Mode (all/my). |
| **Get Teams** | Export all teams in the workspace. |
| **Get Flavors** | Export all flavor definitions. |
| **Get Member Settings** | Export member settings including flavor values. |

---

## Example Use Cases

- **CRM → smenso:** When a deal is won in HubSpot, automatically create a smenso project from a template
- **HR → smenso:** Sync approved absences from your HR system to smenso automatically
- **Form → Task:** Turn incoming contact form submissions into smenso tasks instantly
- **Daily export:** Pull all time records each morning and write them to Google Sheets or your ERP
- **Auto status reports:** Create and publish weekly status reports for all active projects on a schedule
- **Onboarding:** When a new employee is added in HR, create their smenso account, set working times, and assign projects

---

## Resources

- [smenso API Documentation](https://developers.smenso.de)
- [smenso Integration API Swagger](https://dev.smenso.app/skyisland/swagger/integration-json.json)
- [smenso Reporting API Swagger](https://dev.smenso.app/skyisland/swagger/report.json)
- [smenso Help Center](https://help.smenso.de)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

---

## License

MIT

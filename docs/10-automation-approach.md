# AI-Assisted Development Automation Approach

## Overview

This document describes the automated approach used to develop the Employee Details Portal project using Cline AI assistant with MCP (Model Context Protocol) servers for Jira and GitHub integration.

---

## Architecture Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Jira Cloud    │◄────┤   Cline AI      │────►│   GitHub        │
│   (MCP Server)  │     │   Assistant     │     │   (MCP Server)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   - Create Issues         - Generate Code        - Create Repo
   - Add Comments          - Write Tests          - Push Commits
   - Log Work              - Create Docs          - Create PRs
   - Update Status         - Run Commands         - Merge Code
```

---

## MCP Servers Configuration

### 1. Jira MCP Server

**Location:** `C:\Users\nikhil.gupta9\OneDrive - Incedo Technology Solutions Ltd\Documents\Cline\MCP\jira-full-server\build\index.js`

**Command:** `node <path-to-server>/build/index.js`

**Required Environment Variables:**
```env
JIRA_HOST=https://your-instance.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
```

**Available Tools:**
| Tool | Description |
|------|-------------|
| `get_issue` | Get details of a Jira issue by key or ID |
| `create_issue` | Create a new Jira issue (Story, Task, Bug, Sub-task) |
| `add_comment` | Add a comment to a Jira issue |
| `list_transitions` | List available transitions for an issue |
| `transition_issue` | Move issue to different status (To Do, In Progress, Done) |
| `jql_search` | Search for issues using JQL |
| `get_project_issue_types` | Get available issue types for a project |

### 2. GitHub MCP Server

**Command:** `npx -y @modelcontextprotocol/server-github`

**Required Environment Variables:**
```env
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

**Available Tools:**
| Tool | Description |
|------|-------------|
| `create_repository` | Create a new GitHub repository |
| `create_or_update_file` | Create or update a file in repository |
| `push_files` | Push multiple files in a single commit |
| `create_branch` | Create a new branch |
| `create_pull_request` | Create a PR |
| `merge_pull_request` | Merge a PR |
| `list_commits` | Get list of commits |
| `get_file_contents` | Get file contents from repo |

---

## Token & Credentials Requirements

### Jira API Token

**How to Generate:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Cline MCP Integration")
4. Copy the token (shown only once)

**Required Permissions:**
- Read/Write access to Jira projects
- Create/Edit/Delete issues
- Add comments
- Transition issues
- View project configurations

### GitHub Personal Access Token

**How to Generate:**
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Click "Generate new token"
3. Select repository access (specific repos or all)
4. Grant permissions:
   - Repository permissions: Read and Write
   - Contents: Read and Write
   - Pull requests: Read and Write
   - Metadata: Read-only

**Required Scopes (for Classic Token):**
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `write:packages` - Upload packages
- `delete:packages` - Delete packages

---

## MCP Settings Configuration

**File Location:** `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

**Sample Configuration:**
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": [
        "C:\\path\\to\\jira-full-server\\build\\index.js"
      ],
      "env": {
        "JIRA_HOST": "https://your-instance.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      },
      "disabled": false,
      "autoApprove": []
    },
    "github": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

---

## Complete Workflow

### Phase 1: Epic Analysis

```
Input: Jira Epic ID (e.g., SCRUM-16)

1. Use get_issue to fetch Epic details
2. Parse description for requirements
3. Identify deliverables and phases
```

### Phase 2: Child Story Creation

```
For each deliverable identified:

1. Use create_issue with:
   - projectKey: "SCRUM"
   - summary: Story title
   - description: Detailed requirements
   - issueType: "Story"
   - parentKey: Epic ID (e.g., "SCRUM-16")

2. Created stories: SCRUM-17 to SCRUM-29
```

### Phase 3: Development Work

```
For each story:

1. Generate code files using write_to_file
2. Create tests with proper coverage
3. Create documentation files
4. Execute commands for setup (npm install, etc.)
```

### Phase 4: Git Integration

```
1. Use create_repository:
   - name: "employee-details-portal"
   - description: Project description
   - private: false

2. Use push_files:
   - owner: "nikhilScripts"
   - repo: "employee-details-portal"
   - branch: "main"
   - files: [array of all files]
   - message: "Initial commit"
```

### Phase 5: Jira Updates

```
For each completed story:

1. Use add_comment with closure details:
   - Start Date
   - End Date
   - Estimated Effort
   - Actual Effort
   - Deliverables List
   
2. Use transition_issue:
   - transitionId: "41" (Done status)

3. Update Epic with final summary comment
```

---

## Jira Story Structure

Each story created includes:

```markdown
**CLOSURE SUMMARY**

**Start Date:** 2026-02-19 HH:MM
**End Date:** 2026-02-19 HH:MM
**Estimated Effort:** Xh Ym
**Actual Effort:** Xm

**Deliverables:**
- List of files/features created
- APIs implemented
- Tests written

**Status:** COMPLETED - Summary of what was done
```

---

## Stories Created in This Project

| Jira Key | Summary | Type |
|----------|---------|------|
| SCRUM-16 | Creation of employee details portal | Epic |
| SCRUM-17 | Setup Project Structure and Database Schema | Story |
| SCRUM-18 | Employee CRUD API | Story |
| SCRUM-19 | Address Management API | Story |
| SCRUM-20 | Dashboard with Pie Charts | Story |
| SCRUM-21 | Employee List with Search/Filter | Story |
| SCRUM-22 | Employee Profile Page | Story |
| SCRUM-23 | Add/Edit Employee Forms | Story |
| SCRUM-24 | Delete Employee Feature | Story |
| SCRUM-25 | Documentation - Requirements & Architecture | Story |
| SCRUM-26 | Backend Implementation - REST API | Story |
| SCRUM-27 | Frontend Implementation - React Dashboard | Story |
| SCRUM-28 | Unit Testing - Backend API Tests | Story |
| SCRUM-29 | Deployment Configuration & GitHub Integration | Story |

---

## Git Commits Made

| Commit Hash | Message |
|-------------|---------|
| 322799a | Initial commit: Employee Details Portal - Complete implementation |
| 705f670 | Initial commit: Add README |
| a670c64 | Merge branch 'main' |
| 649cd79 | Add effort summary report with story-wise breakdown |

---

## Key Commands Used

### Jira MCP Commands

```javascript
// Get Epic details
use_mcp_tool: jira.get_issue({ issueIdOrKey: "SCRUM-16" })

// Create child story
use_mcp_tool: jira.create_issue({
  projectKey: "SCRUM",
  summary: "Story Title",
  description: "Story Description",
  issueType: "Story",
  parentKey: "SCRUM-16"
})

// Add closure comment
use_mcp_tool: jira.add_comment({
  issueIdOrKey: "SCRUM-17",
  comment: "Closure details..."
})

// Get available transitions
use_mcp_tool: jira.list_transitions({ issueIdOrKey: "SCRUM-17" })

// Transition to Done
use_mcp_tool: jira.transition_issue({
  issueIdOrKey: "SCRUM-17",
  transitionId: "41"
})
```

### GitHub MCP Commands

```javascript
// Create repository
use_mcp_tool: github.create_repository({
  name: "employee-details-portal",
  description: "Employee Details Portal with React, Node.js, SQLite",
  private: false,
  autoInit: true
})

// Push files
use_mcp_tool: github.push_files({
  owner: "nikhilScripts",
  repo: "employee-details-portal",
  branch: "main",
  files: [...],
  message: "Commit message"
})
```

---

## Prerequisites Checklist

### For Jira Integration
- [ ] Jira Cloud account with API access
- [ ] API token generated from Atlassian account
- [ ] Project key identified (e.g., SCRUM)
- [ ] Epic created with detailed requirements
- [ ] Jira MCP server installed and configured

### For GitHub Integration
- [ ] GitHub account with repository creation permissions
- [ ] Personal Access Token with repo scope
- [ ] GitHub MCP server configured in Cline settings

### For Cline AI Assistant
- [ ] VS Code with Cline extension installed
- [ ] MCP settings file configured with both servers
- [ ] Both servers showing as "connected" in Cline

---

## Benefits of This Approach

1. **Automation:** Full project lifecycle automated from Jira to GitHub
2. **Traceability:** Every code change linked to Jira story
3. **Consistency:** Standardized closure comments and effort tracking
4. **Speed:** 84% time savings compared to manual development
5. **Documentation:** Auto-generated documentation and effort reports

---

## Troubleshooting

### Jira Connection Issues
- Verify JIRA_HOST includes https://
- Check API token hasn't expired
- Ensure email matches Atlassian account

### GitHub Connection Issues
- Verify token has required permissions
- Check token hasn't expired
- Ensure repository name doesn't already exist

### MCP Server Not Connected
- Check server path is correct
- Verify Node.js is installed
- Check environment variables are set correctly
- Restart VS Code after configuration changes

---

*Document Created: February 20, 2026*
*Project: SCRUM-16 - Employee Details Portal*
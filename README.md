# Arbiter

```bash
    _   ___ ___ ___ _____ ___ ___
   /_\ | _ \ _ )_ _|_   _| __| _ \
  / _ \|   / _ \| |  | | | _||   /
 /_/ \_\_|_\___/___| |_| |___|_|_\
```

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Streamable_HTTP-8A2BE2)](https://modelcontextprotocol.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server that acts as a central rule engine and resource manager for your development workflows. Arbiter enforces project rules, manages documentation resources, and provides tools for AI assistants to access project-specific knowledge.

## Features

-   **Rule Management**: Define and enforce coding standards, terminal usage rules, and other project guidelines.
-   **Resource Serving**: Serve documentation and rule files as MCP resources (`rules://...`).
-   **Dual Mode Operation**:
    -   **Local Mode**: Runs over Stdio for direct integration with local MCP clients (e.g., Claude Desktop, IDEs).
    -   **Cloud Mode**: Runs as an SSE (Server-Sent Events) server for remote access.
-   **Authentication**: Bearer token authentication for Cloud Mode.
-   **Dynamic Configuration**: Load rules and settings from `config.json`.

## Usage

### Create rule

Add rules to the `rules/` directory and update `config.json` to include them.

example `rules/clean-code.md`:

```markdown
# Clean Code Rules

## 1. Naming
- Use descriptive names
- Avoid abbreviations
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants
```

example `config.json`:

```json
{
  "rules": [
    {
      "id": "clean-code",
      "name": "Clean Code Rules",
      "description": "Standards for writing clean, maintainable code.",
      "path": "clean-code.md"
    }
  ]
}
```

## Installation

### Yarn
```bash
yarn install
```

### NPM
```bash
npm install
```

### PNPM
```bash
pnpm install
```

## Running

### Local Mode (Stdio)

To run locally (e.g., for testing or local MCP client integration):

#### Yarn
```bash
yarn arbiter:local
```

#### NPM
```bash
npm run arbiter:local
```

#### PNPM
```bash
pnpm arbiter:local
```

This will output the configuration needed to add Arbiter to your `claude_desktop_config.json` or other MCP client settings.

### Cloud Mode (SSE)

To run as a server:

#### Yarn
```bash
yarn arbiter
```

#### NPM
```bash
npm run arbiter
```

#### PNPM
```bash
pnpm arbiter
```

The server will start on the port defined in `PORT` 4783.

## Token

You can generate a token using the following command:

#### yarn
```bash
yarn arbiter:token
```

#### npm
```bash
npm run arbiter:token
```

#### pnpm
```bash
pnpm arbiter:token
```

**Environment Variables:**

-   `PORT`: Server port.
-   `MCP_TOKEN`: Bearer token for authentication.

## Configuration

Project rules are defined in `config.json`. Each rule maps a name and ID to a markdown file in the `rules/` directory.

Example `config.json`:

```json
{
  "rules": [
    {
      "id": "clean-code",
      "name": "Clean Code Rules",
      "description": "Standards for writing clean, maintainable code.",
      "path": "clean-code.md"
    }
  ]
}
```

## Auto-generated Tools

For each rule defined in `config.json`, Arbiter automatically generates a tool:

-   `get_<rule_id>`: Retrieves the content of the rule.

## Docker

### Build

```bash
docker build -t arbiter .
```

### Run

```bash
docker run -d -p 4781:4781 \
  -e PORT=4781 \
  -e MCP_TOKEN=your-secret-token \
  arbiter
```

### Docker Compose

```yaml
services:
  arbiter:
    build: .
    ports:
      - '4781:4781'
    environment:
      - PORT=4781
      - MCP_TOKEN=your-secret-token
```

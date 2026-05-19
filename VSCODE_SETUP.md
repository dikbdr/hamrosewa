# VS Code Setup Guide for HamroSewa

Complete guide to set up Visual Studio Code for optimal development experience.

## Table of Contents
1. [Installation](#installation)
2. [Recommended Extensions](#recommended-extensions)
3. [Workspace Settings](#workspace-settings)
4. [Debugging](#debugging)
5. [Useful Shortcuts](#useful-shortcuts)

## Installation

### Download VS Code
- [Visual Studio Code Official](https://code.visualstudio.com/)
- Available for Windows, macOS, and Linux

### Verify Installation
```bash
code --version
```

## Recommended Extensions

Install these extensions for better development experience:

### Core Extensions (Essential)

**1. TypeScript Vue Plugin**
- ID: `Vue.volar`
- Provides TypeScript support for Vue files
- Install: `code --install-extension Vue.volar`

**2. ESLint**
- ID: `dbaeumer.vscode-eslint`
- Lints JavaScript/TypeScript code
- Install: `code --install-eslint`

**3. Prettier - Code Formatter**
- ID: `esbenp.prettier-vscode`
- Auto-formats code
- Install: `code --install-extension esbenp.prettier-vscode`

**4. Git Graph**
- ID: `mhutchie.git-graph`
- Visualize Git commits
- Install: `code --install-extension mhutchie.git-graph`

**5. GitLens**
- ID: `eamodio.gitlens`
- Git blame, history, and more
- Install: `code --install-extension eamodio.gitlens`

### Backend Extensions

**6. REST Client**
- ID: `humao.rest-client`
- Test API endpoints directly in VS Code
- Install: `code --install-extension humao.rest-client`

**7. Thunder Client**
- ID: `rangav.vscode-thunder-client`
- Alternative to Postman
- Install: `code --install-extension rangav.vscode-thunder-client`

**8. Prisma**
- ID: `Prisma.prisma`
- Syntax highlighting for schema.prisma
- Install: `code --install-extension Prisma.prisma`

### Frontend Extensions

**9. Tailwind CSS IntelliSense**
- ID: `bradlc.vscode-tailwindcss`
- Autocomplete for Tailwind classes
- Install: `code --install-extension bradlc.vscode-tailwindcss`

**10. PostCSS Language Support**
- ID: `csstools.postcss`
- CSS variables highlighting
- Install: `code --install-extension csstools.postcss`

**11. ES7+ React/Redux/React-Native snippets**
- ID: `dsznajder.es7-react-js-snippets`
- React code snippets
- Install: `code --install-extension dsznajder.es7-react-js-snippets`

### General Productivity

**12. Bracket Pair Colorizer 2**
- ID: `CoenraadS.bracket-pair-colorizer-2`
- Color-codes matching brackets
- Install: `code --install-extension CoenraadS.bracket-pair-colorizer-2`

**13. Thunder Client**
- ID: `rangav.vscode-thunder-client`
- API testing tool
- Install: `code --install-extension rangav.vscode-thunder-client`

**14. Todo Tree**
- ID: `Gruntfuggly.todo-tree`
- Highlights TODO comments
- Install: `code --install-extension Gruntfuggly.todo-tree`

**15. Docker**
- ID: `ms-azuretools.vscode-docker`
- Docker container support
- Install: `code --install-extension ms-azuretools.vscode-docker`

### Install All at Once
Create a file `install-extensions.sh`:
```bash
#!/bin/bash

# Frontend & General
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension mhutchie.git-graph
code --install-extension eamodio.gitlens
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets

# Backend
code --install-extension Prisma.prisma
code --install-extension rangav.vscode-thunder-client
code --install-extension csstools.postcss

# Productivity
code --install-extension CoenraadS.bracket-pair-colorizer-2
code --install-extension Gruntfuggly.todo-tree
code --install-extension ms-azuretools.vscode-docker
```

Run:
```bash
bash install-extensions.sh
```

## Workspace Settings

### Create Workspace Settings
Create `.vscode/settings.json`:
```json
{
  // Editor
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.mouseWheelZoom": true,

  // TypeScript
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.defaultRenderOptions.showUnusedDeprecations": true,

  // JavaScript
  "javascript.format.enable": true,
  "javascript.updateImportsOnFileMove.enabled": "always",

  // Prettier
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5",
  "prettier.printWidth": 100,

  // ESLint
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],
  "eslint.format.enable": true,

  // Files
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/dist": true,
    "**/.next": true
  },
  "files.associations": {
    ".env*": "properties",
    "*.env": "properties"
  },

  // Search
  "search.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/dist": true,
    "**/.next": true
  },

  // Terminal
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",

  // Git
  "git.ignoreLimitWarning": true,
  "git.autofetch": true,

  // Tailwind
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],

  // React
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Create Launch Configuration
Create `.vscode/launch.json` for debugging:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Backend Debug",
      "type": "node",
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "port": 9229,
      "preLaunchTask": "backend-debug"
    },
    {
      "name": "Frontend Debug",
      "type": "chrome",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/next",
      "runtimeArgs": ["dev"],
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

### Create Tasks Configuration
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^.*$",
          "file": 1,
          "location": 2,
          "message": 3
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "^.*started.*",
          "endsPattern": "^.*ready.*"
        }
      }
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      },
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Run Database Migrations",
      "type": "shell",
      "command": "npm",
      "args": ["run", "db:migrate"],
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Lint Backend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint"],
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Lint Frontend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint"],
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      }
    }
  ]
}
```

## Debugging

### Debug Backend (Node.js)

1. Add breakpoint by clicking line number
2. In `.env`, ensure: `NODE_ENV=development`
3. Start with debugging:
```bash
node --inspect=0.0.0.0:9229 dist/index.js
```

4. In VS Code, select "Backend Debug" configuration
5. Press `F5` or click Run

### Debug Frontend (Browser)

1. Install Debugger for Chrome
2. Add breakpoint
3. Press `F5` to attach debugger
4. Browser DevTools will open

### Debug Tips
- Use `console.log()` for quick debugging
- Use VS Code's Debug Console
- Set breakpoints in code
- Use Watch expressions to monitor variables
- Step through code with F10 (step over) or F11 (step into)

## Useful Shortcuts

### General
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+,` - Settings
- `Ctrl+K, Ctrl+S` - Keyboard Shortcuts

### Editing
- `Alt+Up/Down` - Move line up/down
- `Shift+Alt+Up/Down` - Copy line up/down
- `Ctrl+Shift+K` - Delete line
- `Ctrl+/` - Toggle comment
- `Shift+Alt+F` - Format document

### Navigation
- `Ctrl+P` - Quick open file
- `Ctrl+G` - Go to line
- `Ctrl+Shift+O` - Go to symbol
- `Ctrl+T` - Go to symbol in workspace
- `Ctrl+E` - Recent files

### Terminal
- `Ctrl+J` - Toggle terminal
- `Ctrl+Shift+`` - New terminal
- `Ctrl+K, Ctrl+W` - Close terminal

### Debugging
- `F5` - Start/Continue debugging
- `F9` - Toggle breakpoint
- `F10` - Step over
- `F11` - Step into
- `Shift+F11` - Step out

## Project-Specific Tips

### Opening the Workspace
```bash
# Open entire workspace
code .

# Open specific folder
code frontend
code backend
```

### Multi-Root Workspace
Create `.code-workspace`:
```json
{
  "folders": [
    {
      "path": "frontend",
      "name": "Frontend"
    },
    {
      "path": "backend",
      "name": "Backend"
    }
  ],
  "settings": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

Then open: `code HamroSewa.code-workspace`

### Useful Extensions Keyboard Shortcuts
- **Prettier**: `Shift+Alt+F` - Format document
- **ESLint**: `Ctrl+Shift+L` - Show problems
- **GitLens**: `Alt+G` - Show git blame
- **Todo Tree**: `Ctrl+Shift+T` - Show TODOs

## Recommended VS Code Settings for Teams

Add to workspace settings for consistency:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.format.insertSpaceBeforeFunctionParenthesis": true,
  "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "typescript.format.placeOpenBraceOnNewLineForFunctions": false
}
```

---

Now you're ready to develop! Happy coding! 🚀

# Pomodoro Timer

A cross-platform desktop Pomodoro timer application built with Tauri, React, and TypeScript. This application helps you manage your work sessions using the Pomodoro Technique, a time management method that uses a timer to break work into intervals.

## Features

- Customizable timer durations for:
  - Pomodoro sessions
  - Short breaks
  - Long breaks
- Dark/Light theme support
- Timer progress visualization
- Session history tracking
- Cross-platform support (Windows, macOS, Linux)

## Tech Stack

- Frontend: React + TypeScript + Vite
- Desktop: Tauri (Rust)
- Styling: Tailwind CSS
- UI Components: shadcn/ui

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

### Prerequisites

- Node.js
- Rust
- npm

### Run in development mode

For just frontend in browser:

```bash
npm run dev
```

For Tauri desktop app:

```bash
npm run tauri dev
```

### Build for production

To create a release bundle:

```bash
npm run tauri build
```

### Testing

Run tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Generate test coverage:

```bash
npm run test:coverage
```

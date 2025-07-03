# RepoMix VS Code Extension

A Visual Studio Code extension that streamlines your workflow with [RepoMix](https://github.com/yamadashy/repomix) by focusing on your currently open files. Perfect for large projects where you only need to analyze specific parts of your codebase with AI tools.

## Features

- **Smart File Selection**: Automatically packages only the files currently open in your VS Code editor
- **Context Menu Integration**: Simply right-click in the editor and select "RepoMix: Pack Open Files"
- **Optimized for Large Projects**: No need to pack your entire codebase when you're only working with specific files

## Build

```bash
npm install
npm run package
```

## Installation

### Option 1: Install from VSIX (Recommended)
1. Install the VS Code Extension Manager CLI if you haven't already:
   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:
   ```bash
   npx vsce package
   ```

3. Install the generated .vsix file:
   ```bash
   code --install-extension vscode-repomix-1.0.0.vsix
   ```

### Option 2: Manual Installation via VS Code UI
1. Package the extension:
   ```bash
   npx vsce package
   ```

2. Open Visual Studio Code
3. Go to the Extensions view (Ctrl+Shift+X)
4. Click the "..." (More Actions) button in the Extensions view
5. Select "Install from VSIX..."
6. Choose the generated `vscode-repomix-1.0.0.vsix` file

### Option 3: Development Mode
For development and testing:
```bash
npm install
npm run compile
# Then press F5 in VS Code to launch Extension Development Host
```

## Usage

1. Open the files you want to analyze in VS Code
2. Right-click anywhere in the editor
3. Select "RepoMix: Pack Open Files" from the context menu
4. Your packed files will be generated in the RepoMix format


## Requirements

- Visual Studio Code version 1.60.0 or higher
- [RepoMix](https://github.com/yamadashy/repomix) (installed automatically as a dependency)

## Configuration

[Configuration options coming soon]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

This extension builds upon and integrates with:
- [RepoMix](https://github.com/yamadashy/repomix) - For AI-friendly code packaging
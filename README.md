# RepoMix VS Code Extension

A Visual Studio Code extension that streamlines your workflow with [RepoMix](https://github.com/yamadashy/repomix) by focusing on your currently open files. Perfect for large projects where you only need to analyze specific parts of your codebase with AI tools.

## Features

- **Smart File Selection**: Automatically packages only the files currently open in your VS Code editor
- **Context Menu Integration**: Simply right-click in the editor and select "RepoMix: Pack Open Files"
- **Optional ClaudeSync Integration**: Seamlessly sync your packed files to Claude.ai using [ClaudeSync](https://github.com/jahwag/ClaudeSync)
- **Optimized for Large Projects**: No need to pack your entire codebase when you're only working with specific files

## Build

npm install -g @vscode/vsce
npm install
vsce package


## Installation

1. Open Visual Studio Code
2. Go to the Extensions view
3. Click 3 dots
4. Click Install from VSIX

## Usage

1. Open the files you want to analyze in VS Code
2. Right-click anywhere in the editor
3. Select "RepoMix: Pack Open Files" from the context menu
4. Your packed files will be generated in the RepoMix format

### With ClaudeSync Integration

If you have ClaudeSync configured:
1. Follow the steps above
2. The packed files will automatically sync to your associated Claude.ai project

## Requirements

- Visual Studio Code version 1.60.0 or higher
- [RepoMix](https://github.com/yamadashy/repomix) (required)
- [ClaudeSync](https://github.com/jahwag/ClaudeSync) (optional)

## Configuration

[Configuration options coming soon]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

This extension builds upon and integrates with:
- [RepoMix](https://github.com/yamadashy/repomix) - For AI-friendly code packaging
- [ClaudeSync](https://github.com/jahwag/ClaudeSync) - For Claude.ai integration

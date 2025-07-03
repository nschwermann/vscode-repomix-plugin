# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-07-03

### Fixed
- Fixed "Open File" button in notification to correctly open `repomix-selection.xml`
- Removed "Sync to Claude" button from notification dialogs
- Fixed error handling when opening the repomix output file

### Removed
- Removed Claude sync functionality and related status bar items
- Cleaned up unused Claude sync code and interfaces

### Technical
- Reduced extension size by removing unused code
- Improved error messages for file operations
- Streamlined extension to focus only on Repomix functionality

## [1.0.0] - 2025-07-03

### Added
- Initial release of VSCode Repomix extension
- Pack open files with Repomix functionality
- Pack selected files from explorer
- Context menu integration
- Status bar integration
- Progress notifications
- Output channel for debugging

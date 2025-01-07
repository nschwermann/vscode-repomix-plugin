import * as vscode from 'vscode';
import { join } from 'path';
import * as fs from 'fs/promises';

const defaultConfig = {
    output: {
        filePath: "repomix-selection.xml",
        style: "xml",
        instructionFilePath: "repomix-instructions.md",
        fileSummary: true,
        directoryStructure: true,
        removeComments: false,
        removeEmptyLines: false,
        topFilesLength: 5,
        showLineNumbers: false,
        copyToClipboard: false
    },
    include: [],
    ignore: {
        useGitignore: true,
        useDefaultPatterns: true,
        customPatterns: []
    },
    security: {
        enableSecurityCheck: false
    },
    tokenCount: {
        encoding: "o200k_base"
    }
};

const defaultInstructions = `# Coding Guidelines
- When given a prompt think through the problem, then give an outline of your proposed solution
- Ask the user if they would like to proceed with this approach before generating any code
- If you need more context from files which have been omitted ask to see them or for more details
- Suggest splitting files into smaller, focused units when appropriate
- Add comments for non-obvious logic. Keep all text in English
- Use best coding practices, suggest refactoring existing code to follow best practices when appropriate

# Generate Comprehensive Output
- Include all content without abbreviation, unless specified otherwise
- Optimize for handling large codebases while maintaining output quality`;


const CLAUDEIGNORE_CONTENT = `# First ignore everything
*

# Then unignore repomix-output files
!repomix-output*`;

export async function ensureConfigFiles(workspacePath: string, outputChannel: vscode.OutputChannel): Promise<void> {
    const configPath = join(workspacePath, 'repomix.config.json');
    const instructionsPath = join(workspacePath, 'repomix-instructions.md');
    const ignorePath = join(workspacePath, '.claudeignore');

    try {
        // Check if files already exist
        const [configExists, instructionsExists, ignoreExists] = await Promise.all([
            fileExists(configPath),
            fileExists(instructionsPath),
            fileExists(ignorePath)
        ]);

        // Create only missing files
        const filesToCreate = [];
        
        if (!configExists) {
            filesToCreate.push(
                fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8')
                    .then(() => outputChannel.appendLine('Created repomix.config.json'))
            );
        }
        
        if (!instructionsExists) {
            filesToCreate.push(
                fs.writeFile(instructionsPath, defaultInstructions, 'utf8')
                    .then(() => outputChannel.appendLine('Created repomix-instructions.md'))
            );
        }

        if (!ignoreExists) {
            filesToCreate.push(
                fs.writeFile(ignorePath, CLAUDEIGNORE_CONTENT, 'utf8')
                    .then(() => outputChannel.appendLine('Created .claudeignore'))
            );
        }

        if (filesToCreate.length > 0) {
            await Promise.all(filesToCreate);
            // Only show notification if we created new files
            vscode.window.showInformationMessage('Repomix configuration files created successfully!');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to create configuration files: ${errorMessage}`);
    }
}

async function fileExists(path: string): Promise<boolean> {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}
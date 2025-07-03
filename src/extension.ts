import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import { ensureConfigFiles } from './initialization';

// Create an output channel
let outputChannel: vscode.OutputChannel;

async function getExecutablePath(configKey: string, defaultExecutable: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('vscode-repomix');
    const customPath = config.get<string>(configKey, '');
    
    if (customPath) {
        // Check if custom path exists
        if (existsSync(customPath)) {
            return customPath;
        }
        // Show warning if custom path is invalid
        const result = await vscode.window.showWarningMessage(
            `Custom path for ${defaultExecutable} is invalid: ${customPath}. Would you like to configure it?`,
            'Configure', 'Use Default'
        );
        if (result === 'Configure') {
            await vscode.commands.executeCommand('workbench.action.openSettings', `vscode-repomix.${configKey}`);
        }
    }
    
    return defaultExecutable;
}

export function activate(context: vscode.ExtensionContext) {
    // Initialize output channel
    outputChannel = vscode.window.createOutputChannel('Repomix');

    // Create Repomix status bar item
    const repomixStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        99
    );
    repomixStatusBarItem.text = "$(package) Pack Files";
    repomixStatusBarItem.tooltip = "Pack open files with Repomix";
    repomixStatusBarItem.command = 'vscode-repomix.packOpenFiles';
    repomixStatusBarItem.show();

    // Command to pack currently open files
    let packOpenFiles = vscode.commands.registerCommand('vscode-repomix.packOpenFiles', async () => {
        const openFiles: string[] = [];
        
        // Get all tab groups
        for (const tabGroup of vscode.window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                if (tab.input instanceof vscode.TabInputText) {
                    const uri = tab.input.uri;
                    if (uri.scheme === 'file') {
                        openFiles.push(uri.fsPath);
                    }
                }
            }
        }

        if (openFiles.length === 0) {
            vscode.window.showWarningMessage('No open files to pack!');
            return;
        }

        outputChannel.appendLine(`Packing ${openFiles.length} open files:`);
        openFiles.forEach(file => outputChannel.appendLine(file));

        await packFiles(openFiles);
    });

    // Command to pack selected files from explorer
    let packSelectedFiles = vscode.commands.registerCommand('vscode-repomix.packSelectedFiles', async (uri: vscode.Uri, uris: vscode.Uri[]) => {
        const files = uris ? uris.map(u => u.fsPath) : [uri.fsPath];
        await packFiles(files);
    });

    context.subscriptions.push(packOpenFiles, packSelectedFiles, repomixStatusBarItem);
}

async function packFiles(files: string[]) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open!');
        return;
    }

    // Check and create configuration files if needed
    try {
        await ensureConfigFiles(workspaceFolder.uri.fsPath, outputChannel);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        outputChannel.appendLine(`Warning: Failed to create configuration files: ${errorMessage}`);
        // Continue with packing even if config creation fails
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    
    // Convert absolute paths to relative paths from workspace root
    const relativeFiles = files.map(f => {
        const relativePath = f.replace(workspacePath + '/', '').replace(workspacePath + '\\', '');
        // Escape any special characters in the path
        return relativePath.replace(/([,\s])/g, '\\$1');
    });
    
    const includePattern = relativeFiles.join(',');

    try {
        // Clear and show output channel
        outputChannel.clear();
        outputChannel.show(true);

        // Show progress indicator
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Packing files with Repomix",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });
            
            const repomixPath = await getExecutablePath('repomixPath', 'repomix');
            await new Promise<void>((resolve, reject) => {
                const args = [
                    '--include', `"${includePattern}"`,
                    '--copy'
                ];

                const process = spawn(repomixPath, args, { 
                    cwd: workspacePath,
                    shell: true
                });

                // Handle stdout in real-time
                process.stdout.on('data', (data) => {
                    outputChannel.append(data.toString());
                });

                // Handle stderr in real-time
                process.stderr.on('data', (data) => {
                    outputChannel.append(data.toString());
                });                    // Handle process completion
                    process.on('close', async (code) => {
                        if (code !== 0) {
                            reject(new Error(`Repomix process exited with code ${code}`));
                            return;
                        }

                        progress.report({ increment: 100 });

                        // Create persistent notification with multiple actions
                        const showNotification = async (): Promise<void> => {
                            const selection = await vscode.window.showInformationMessage(
                                'Files successfully packed with Repomix!',
                                { modal: false, detail: 'Select any actions below or click Done when finished.' },
                                'Open File',
                                'View Output',
                                'Done'
                            );

                            if (!selection) {
                                return; // User dismissed notification
                            }

                            switch (selection) {
                                case 'Open File': {
                                    const outputPath = join(workspacePath, 'repomix-selection.xml');
                                    try {
                                        const doc = await vscode.workspace.openTextDocument(outputPath);
                                        await vscode.window.showTextDocument(doc, { preview: false });
                                    } catch (error) {
                                        vscode.window.showErrorMessage(`Could not open repomix-selection.xml: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                    }
                                    return showNotification();
                                }
                                case 'View Output': {
                                    outputChannel.show(true);
                                    return showNotification();
                                }
                                case 'Done': {
                                    return;
                                }
                            }
                        };

                        await showNotification();
                        resolve();
                    });

                process.on('error', (error) => {
                    reject(error);
                });
            });
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Error packing files: ${errorMessage}`);
        outputChannel.appendLine(`Error: ${errorMessage}`);
    }
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
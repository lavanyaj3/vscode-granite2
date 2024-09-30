import { commands, ExtensionContext } from "vscode";
import { SetupGranitePage } from "./panels/setupGranitePage";
import { Telemetry } from "./telemetry";

export async function activate(context: ExtensionContext) {
  // Initialize telemetry
  await Telemetry.initialize(context);

  // Register the setup command
  const setupGraniteCmd = commands.registerCommand("vscode-granite.setup", async () => {
    await Telemetry.send("granite.commands.setup");
    SetupGranitePage.render(context.extensionUri, context.extensionMode);
  });
  context.subscriptions.push(setupGraniteCmd);

  // Check if the setup has already run using globalState
  const hasRunBefore = context.globalState.get('hasRunSetup', false);

  // Check if we are in dev mode using the OLLAMA_MOCK environment variable
  const isDevMode = process.env.OLLAMA_MOCK === 'true';

  // If the setup hasn't run before or if we are in dev mode, show the welcome page
  if (!hasRunBefore || isDevMode) {
    // Set the flag in global storage indicating that setup has been completed
    await context.globalState.update('hasRunSetup', true);

    // Execute the setup command to show the welcome page
    return commands.executeCommand('vscode-granite.setup');
  }

  // No setup required if it has been run before and we're not in dev mode
}

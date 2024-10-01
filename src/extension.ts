import { commands, ExtensionContext, ExtensionMode } from "vscode";
import { SetupGranitePage } from "./panels/setupGranitePage";
import { Telemetry } from "./telemetry";
export async function activate(context: ExtensionContext) {
  await Telemetry.initialize(context);
  const setupGraniteCmd = commands.registerCommand("vscode-granite.setup", async () => {
    await Telemetry.send("granite.commands.setup");
    const isDevMode: boolean = context.extensionMode === ExtensionMode.Development;
    SetupGranitePage.render(context.extensionUri, isDevMode);
  });
  context.subscriptions.push(setupGraniteCmd);
  const hasRunBefore = context.globalState.get('hasRunSetup', false);
  if (!hasRunBefore) {
    await context.globalState.update('hasRunSetup', true);
    return commands.executeCommand('vscode-granite.setup');
  }
}

import { commands, ExtensionContext } from "vscode";
import { SetupGranitePage } from "./panels/setupGranitePage";
import { Telemetry } from "./telemetry";
import { isDevMode } from "./commons/constants";

export async function activate(context: ExtensionContext) {
  await Telemetry.initialize(context);
  const setupGraniteCmd = commands.registerCommand("vscode-granite.setup", async () => {
    await Telemetry.send("granite.commands.setup");
    SetupGranitePage.render(context.extensionUri, context.extensionMode);
  });
  context.subscriptions.push(setupGraniteCmd);
  const hasRunBefore = context.globalState.get('hasRunSetup', false);
  if (!hasRunBefore || isDevMode) {
    await context.globalState.update('hasRunSetup', true);
    return commands.executeCommand('vscode-granite.setup');
  }
}

import { ExtensionContext } from "vscode";

export async function writeStorage(
  key: string,
  value: number,
  context: ExtensionContext
) {
  await context.workspaceState.update(key, value);
}

export async function readStorage(
  key: string,
  context: ExtensionContext
): Promise<number> {
  return (await context.workspaceState.get(key)) || 0;
}

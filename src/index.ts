import { commands, ExtensionContext, listManager, workspace } from 'coc.nvim';
import fs from 'fs';
import DB from './db';
import ProjectList from './lists';
import { newProject, createItem } from './model';
import path from 'path';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('project-manager');

  const enable = config.get<boolean>('enabled', true);
  if (!enable) return;

  const { storagePath } = context;
  const fileName = 'PM_Cache';

  await fs.mkdir(storagePath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const file = path.join(storagePath, `${fileName}.json`);

  fs.exists(file, async (isExist) => {
    if (!isExist) {
      await fs.writeFile(file, '[]', (err) => {
        if (err) throw err;
      });
    }
  });

  const db = new DB(storagePath, fileName);

  context.subscriptions.push(
    commands.registerCommand('project-manager.Create', async () => {
      createItem(db);
    }),

    listManager.registerList(new ProjectList(workspace.nvim, db))
  );
}

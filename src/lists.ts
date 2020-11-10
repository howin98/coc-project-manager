import { BasicList, ListAction, ListContext, ListItem, Neovim, workspace } from 'coc.nvim';
import { ProjectData, updateItem, createItem } from './model';
import DB from './db';

export default class ProjectList extends BasicList {
  public readonly name = 'projects';
  public readonly description = 'CocList for project-manager';
  public readonly defaultAction = 'switch';
  public actions: ListAction[] = [];

  constructor(nvim: Neovim, private db: DB) {
    super(nvim);

    this.addAction(
      'delete',
      async (item: ListItem) => {
        const { uid } = item.data as ProjectData;
        await this.db.delete(uid);
      },
      { persist: true, reload: true }
    );
    this.addAction(
      'switch',
      (item: ListItem) => {
        const { data } = item.data as ProjectData;
        const command = `CocCommand explorer ${data.path}`;
        workspace.nvim.command(command);
      },
      { persist: true, reload: true }
    );
    this.addAction('update', async (item: ListItem) => {
      const { uid, data } = item.data as ProjectData;
      const newItem = await updateItem(data);
      if (newItem.name && newItem.path) {
        await this.db.update(uid, newItem);
      }
    });
    this.addAction('create', async (_item: ListItem) => {
      createItem(this.db);
    });
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    const arr = await this.db.load();
    const res: ListItem[] = [];
    for (const item of arr) {
      const { name, description } = item.data;
      const label = `${name} \t ${description ? description : ''}`;
      res.push({
        label,
        filterText: name,
        data: Object.assign({}, item),
      });
    }
    return res;
  }
}

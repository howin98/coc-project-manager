import path from 'path';
import fs from 'fs';
import { ProjectItem, ProjectData } from './model';
import { v4 as uuidv4 } from 'uuid';

export default class DB {
  private file: string;

  constructor(directory: string, name: string) {
    this.file = path.join(directory, `${name}.json`);
  }

  public async load(): Promise<ProjectData[]> {
    const content = await fs.promises.readFile(this.file, { encoding: 'utf-8' });
    return JSON.parse(content) as ProjectData[];
  }

  public async add(data: ProjectItem): Promise<void> {
    const items = await this.load();
    items.unshift({ uid: uuidv4(), data: data });
    await fs.promises.writeFile(this.file, JSON.stringify(items, null, 2));
  }

  public async delete(uid: string): Promise<void> {
    const items = await this.load();
    const idx = items.findIndex((o) => o.uid == uid);
    if (idx !== -1) {
      items.splice(idx, 1);
      await fs.promises.writeFile(this.file, JSON.stringify(items, null, 2));
    }
  }

  public async update(uid: string, data: ProjectItem): Promise<void> {
    const items = await this.load();
    const idx = items.findIndex((o) => o.uid == uid);
    if (idx !== -1) {
      items[idx].data = data;
      await fs.promises.writeFile(this.file, JSON.stringify(items, null, 2));
    }
  }
}

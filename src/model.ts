import { workspace } from 'coc.nvim';
import DB from './db';

export interface ProjectItem {
  name: string;
  path: string;
  description: string;
}

export interface ProjectData {
  uid: string;
  data: ProjectItem;
}

export function newProject(): ProjectItem {
  return {
    name: '',
    path: '',
    description: '',
  } as ProjectItem;
}

export async function updateItem(data: ProjectItem): Promise<ProjectItem> {
  return await {
    name: await workspace.requestInput('input name:', data.name),
    path: await workspace.requestInput('input path:', data.path),
    description: await workspace.requestInput('input descripton:', data.description),
  };
}

export async function createItem(db: DB) {
  const project = newProject();
  const name = await workspace.requestInput('Input the name');
  if (!(name?.trim().length > 0)) return;

  const path = await workspace.requestInput('Input the path', `${workspace.root}`);
  if (!(path?.trim().length > 0)) return;

  const description = await workspace.requestInput('Input the description');

  project.name = name.trim();
  project.path = path.trim();
  project.description = description ? description : '';
  db.add(project);
}

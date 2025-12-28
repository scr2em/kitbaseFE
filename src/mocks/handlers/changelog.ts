import { http, HttpResponse, delay } from 'msw';
import { nanoid } from 'nanoid';

interface Changelog {
  id: string;
  version: string;
  markdown: string;
  is_published: boolean;
  projectKey: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory store for changelogs
const changelogs: Map<string, Changelog> = new Map();

// Helper to generate ID
function generateId(): string {
  return nanoid();
}

// Helper to get changelogs for a specific project
function getChangelogsForProject(projectKey: string): Changelog[] {
  return Array.from(changelogs.values())
    .filter((c) => c.projectKey === projectKey)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Helper to check if version exists for project
function versionExistsForProject(projectKey: string, version: string, excludeId?: string): boolean {
  return Array.from(changelogs.values()).some(
    (c) => c.projectKey === projectKey && c.version === version && c.id !== excludeId
  );
}

export const changelogHandlers = [
  // List changelogs for a project
  http.get('/api/projects/:projectKey/changelogs', async ({ params, request }) => {
    await delay(300);
    
    const { projectKey } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    
    const projectChangelogs = getChangelogsForProject(projectKey as string);
    const totalElements = projectChangelogs.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const data = projectChangelogs.slice(start, end);
    
    return HttpResponse.json({
      data,
      page,
      size,
      totalElements,
      totalPages,
    });
  }),

  // Get single changelog
  http.get('/api/projects/:projectKey/changelogs/:id', async ({ params }) => {
    await delay(200);
    
    const { id } = params;
    const changelog = changelogs.get(id as string);
    
    if (!changelog) {
      return HttpResponse.json(
        { message: 'Changelog not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(changelog);
  }),

  // Create changelog
  http.post('/api/projects/:projectKey/changelogs', async ({ params, request }) => {
    await delay(400);
    
    const { projectKey } = params;
    const body = await request.json() as { version: string; markdown: string; is_published?: boolean };
    
    // Check for duplicate version
    if (versionExistsForProject(projectKey as string, body.version)) {
      return HttpResponse.json(
        { message: 'A changelog for this version already exists' },
        { status: 409 }
      );
    }
    
    const now = new Date().toISOString();
    const changelog: Changelog = {
      id: generateId(),
      version: body.version,
      markdown: body.markdown,
      is_published: body.is_published ?? false,
      projectKey: projectKey as string,
      createdAt: now,
      updatedAt: now,
    };
    
    changelogs.set(changelog.id, changelog);
    
    return HttpResponse.json(changelog, { status: 201 });
  }),

  // Update changelog
  http.put('/api/projects/:projectKey/changelogs/:id', async ({ params, request }) => {
    await delay(400);
    
    const { projectKey, id } = params;
    const body = await request.json() as { version: string; markdown: string; is_published?: boolean };
    
    const existing = changelogs.get(id as string);
    if (!existing) {
      return HttpResponse.json(
        { message: 'Changelog not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate version (excluding current)
    if (versionExistsForProject(projectKey as string, body.version, id as string)) {
      return HttpResponse.json(
        { message: 'A changelog for this version already exists' },
        { status: 409 }
      );
    }
    
    const updated: Changelog = {
      ...existing,
      version: body.version,
      markdown: body.markdown,
      is_published: body.is_published ?? existing.is_published,
      updatedAt: new Date().toISOString(),
    };
    
    changelogs.set(id as string, updated);
    
    return HttpResponse.json(updated);
  }),

  // Delete changelog
  http.delete('/api/projects/:projectKey/changelogs/:id', async ({ params }) => {
    await delay(300);
    
    const { id } = params;
    
    if (!changelogs.has(id as string)) {
      return HttpResponse.json(
        { message: 'Changelog not found' },
        { status: 404 }
      );
    }
    
    changelogs.delete(id as string);
    
    return new HttpResponse(null, { status: 204 });
  }),
];

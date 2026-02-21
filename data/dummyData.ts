import {
  ActivityLog,
  CaptureEntry,
  ProjectMember,
  TimeLog,
} from "@/domain/project";

const now = new Date().toISOString();

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

// export const dummyProject: Project = {
//   projectId: "project-1",
//   projectName: "97 Highams Road",
//   address: "97 Highams Road, London",
//   createdByUserId: "user-admin-1",
//   createdAt: daysAgo(30),
// };

export const dummyMembers: ProjectMember[] = [
  {
    id: "pm-1",
    projectId: "project-1",
    userId: "user-1",
    role: "admin",
  },
  {
    id: "pm-2",
    projectId: "project-1",
    userId: "user-2",
    role: "worker",
  },
  {
    id: "pm-3",
    projectId: "project-1",
    userId: "user-3",
    role: "worker",
  },
];

export const dummyTimeLogs: TimeLog[] = [
  {
    id: "tl-1",
    projectId: "project-1",
    userId: "user-2",
    clockInAt: "2026-04-12T08:00:00Z",
    clockOutAt: "2026-04-12T17:00:00Z",
  },
  {
    id: "tl-2",
    projectId: "project-1",
    userId: "user-3",
    clockInAt: "2026-04-12T08:10:00Z",
    clockOutAt: "2026-04-12T16:45:00Z",
  },
];

export const dummyCaptures: CaptureEntry[] = [
  {
    id: "cap-1",
    projectId: "project-1",
    createdByUserId: "user-2",
    categoryId: "cat-structural",
    type: "video",
    shortDescription: "Steel beam installation walkthrough",
    createdAt: "2026-04-12T09:47:00Z",
  },
  {
    id: "cap-2",
    projectId: "project-1",
    createdByUserId: "user-3",
    categoryId: "cat-receipt",
    type: "photo",
    shortDescription: "Material receipt from supplier",
    createdAt: "2026-04-12T11:20:00Z",
  },
  {
    id: "cap-3",
    projectId: "project-1",
    createdByUserId: "user-2",
    categoryId: "cat-plumbing",
    type: "incident",
    shortDescription: "Minor pipe leak identified",
    createdAt: "2026-04-12T12:02:00Z",
  },
];

export const dummyActivityLogs: ActivityLog[] = [
  {
    id: "al-1",
    projectId: "project-1",
    userId: "user-2",
    actionType: "CLOCK_IN",
    createdAt: "2026-04-12T08:00:00Z",
    displayMessage: "Roman Seniv “Clocked in”",
  },
  {
    id: "al-2",
    projectId: "project-1",
    userId: "user-2",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "video",
      category: "Structural Works",
      count: 1,
    },
    createdAt: "2026-04-12T09:47:00Z",
    displayMessage: '1 Video added to Category "Structural Works"',
  },
  {
    id: "al-3",
    projectId: "project-1",
    userId: "user-3",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "photo",
      category: "Receipt",
      count: 3,
    },
    createdAt: "2026-04-12T11:20:00Z",
    displayMessage: '3 Photos added to Category "Receipt"',
  },
  {
    id: "al-4",
    projectId: "project-1",
    userId: "user-2",
    actionType: "INCIDENT_CREATED",
    metadata: {
      severity: "low",
    },
    createdAt: "2026-04-12T12:02:00Z",
    displayMessage:
      "Accident report has been created. This one is extremely extremely extremely extremely extremely urgent to be looked at",
  },
  {
    id: "al-1",
    projectId: "project-1",
    userId: "user-2",
    actionType: "CLOCK_IN",
    createdAt: "2026-04-12T08:00:00Z",
    displayMessage: "Roman Seniv “Clocked in”",
  },
  {
    id: "al-2",
    projectId: "project-1",
    userId: "user-2",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "video",
      category: "Structural Works",
      count: 1,
    },
    createdAt: "2026-04-12T09:47:00Z",
    displayMessage: '1 Video added to Category "Structural Works"',
  },
  {
    id: "al-3",
    projectId: "project-1",
    userId: "user-3",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "photo",
      category: "Receipt",
      count: 3,
    },
    createdAt: "2026-04-12T11:20:00Z",
    displayMessage: '3 Photos added to Category "Receipt"',
  },
  {
    id: "al-4",
    projectId: "project-1",
    userId: "user-2",
    actionType: "INCIDENT_CREATED",
    metadata: {
      severity: "low",
    },
    createdAt: "2026-04-12T12:02:00Z",
    displayMessage:
      "Accident report has been created. This one is extremely extremely extremely extremely extremely urgent to be looked at",
  },
  {
    id: "al-1",
    projectId: "project-1",
    userId: "user-2",
    actionType: "CLOCK_IN",
    createdAt: "2026-04-12T08:00:00Z",
    displayMessage: "Roman Seniv “Clocked in”",
  },
  {
    id: "al-2",
    projectId: "project-1",
    userId: "user-2",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "video",
      category: "Structural Works",
      count: 1,
    },
    createdAt: "2026-04-12T09:47:00Z",
    displayMessage: '1 Video added to Category "Structural Works"',
  },
  {
    id: "al-3",
    projectId: "project-1",
    userId: "user-3",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "photo",
      category: "Receipt",
      count: 3,
    },
    createdAt: "2026-04-12T11:20:00Z",
    displayMessage: '3 Photos added to Category "Receipt"',
  },
  {
    id: "al-4",
    projectId: "project-1",
    userId: "user-2",
    actionType: "INCIDENT_CREATED",
    metadata: {
      severity: "low",
    },
    createdAt: "2026-04-12T12:02:00Z",
    displayMessage:
      "Accident report has been created. This one is extremely extremely extremely extremely extremely urgent to be looked at",
  },
  {
    id: "al-1",
    projectId: "project-1",
    userId: "user-2",
    actionType: "CLOCK_IN",
    createdAt: "2026-04-12T08:00:00Z",
    displayMessage: "Roman Seniv “Clocked in”",
  },
  {
    id: "al-2",
    projectId: "project-1",
    userId: "user-2",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "video",
      category: "Structural Works",
      count: 1,
    },
    createdAt: "2026-04-12T09:47:00Z",
    displayMessage: '1 Video added to Category "Structural Works"',
  },
  {
    id: "al-3",
    projectId: "project-1",
    userId: "user-3",
    actionType: "MEDIA_ADDED",
    metadata: {
      captureType: "photo",
      category: "Receipt",
      count: 3,
    },
    createdAt: "2026-04-12T11:20:00Z",
    displayMessage: '3 Photos added to Category "Receipt"',
  },
  {
    id: "al-4",
    projectId: "project-1",
    userId: "user-2",
    actionType: "INCIDENT_CREATED",
    metadata: {
      severity: "low",
    },
    createdAt: "2026-04-12T12:02:00Z",
    displayMessage: "Accident report has been created",
  },
];

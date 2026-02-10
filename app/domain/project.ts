export type UserRole = "admin" | "worker" | "viewer";
export type CaptureType =
  | "photo"
  | "video"
  | "audio"
  | "note"
  | "incident"
  | "certificate";
export type MediaType = "image" | "video" | "audio";
export type ActivityActionType =
  | "CLOCK_IN"
  | "MEDIA_ADDED"
  | "INCIDENT_CREATED";
export type ExportType = "timeline" | "receipts" | "media" | "full_project";

export type ID = string;
export type ISODateTime = string;
export type ISODate = string;

export type Project = {
  id: ID;
  name: string;
  address: string;
  createdByUserId: ID;
  createdAt: string;
};

export type ProjectMember = {
  id: ID;
  projectId: ID;
  userId: ID;
  role: UserRole;
};

export type TimeLog = {
  id: ID;
  projectId: ID;
  userId: ID;
  clockInAt: ISODateTime;
  clockOutAt?: ISODateTime | null;
};

export type Category = {
  id: ID;
  name: string;
};

export type CaptureEntry = {
  id: ID;
  projectId: ID;
  createdByUserId: ID;
  categoryId: ID;
  type: CaptureType;
  shortDescription: string;
  createdAt: ISODateTime;
};

export type Media = {
  id: ID;
  captureEntryId: ID;
  fileUrl: string;
  mediaType: MediaType;
  durationSeconds?: number | null;
  createdAt: ISODateTime;
};

export type IncidentReport = {
  id: ID;
  captureEntryId: ID;
  severity?: "low" | "medium" | "high" | "critical";
  description: string;
};

export type Certificate = {
  id: ID;
  captureEntryId: ID;
  documentType: "certificate" | "license" | "report";
  expiryDate?: ISODate | null;
};

export type ActivityLog = {
  id: ID;
  projectId: ID;
  userId: ID;
  actionType: ActivityActionType;
  metadata?: Record<string, unknown>;
  createdAt: ISODateTime;
  displayMessage: string;
};

export type Notification = {
  id: ID;
  userId: ID;
  activityLogId: ID;
  readAt?: ISODateTime | null;
};

export type ExportRequest = {
  id: ID;
  projectId: ID;
  type: ExportType;
  requestedByUserId: ID;
  createdAt: ISODateTime;
};

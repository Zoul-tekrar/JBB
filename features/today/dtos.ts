import { ID, ISODateTime } from "@/domain/project";

export type ActivityLogDto = {
  id: ID;
  createdAt: ISODateTime;
  activityType: string;
  activityMessage: string;
  category: string;
};

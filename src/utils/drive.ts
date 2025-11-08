import type { DrivelistResponse } from "./types";

const BASE = "https://www.googleapis.com/drive/v3/files";

const  fields = "files(id,name,size,modifiedTime, mimeType),nextPageToken";


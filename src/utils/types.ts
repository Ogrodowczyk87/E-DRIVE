export type DriveFile = {
    id: string;
    name: string;
    modifiedTime: string;
    size?: string;
    mimeType?: string;
    parents?: string[];
    iconHint?: string;
};

export type DriveListResponse = {
    files: DriveFile[];
    nextPageToken?: string;
};

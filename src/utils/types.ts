export type DriveFile = {
    id: string;
    name: string;
    modifiedTime: string;
    size?: string;
    parents?: string[];
    iconHint?: string;
};

export type DrivelistResponse = {
    files: DriveFile[];
    nextPageToken?: string;
};

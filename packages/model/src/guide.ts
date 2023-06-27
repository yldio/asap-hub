export type GuideContentDataObject = {
title: string;
linkText: string;
linkURL: string;
text: string;
};

export type GuideContentResponse= GuideContentDataObject;

export type GuideDataObject = {
    title: string;
    content: GuideContentResponse[];
};

export type GuideResponse = GuideDataObject;

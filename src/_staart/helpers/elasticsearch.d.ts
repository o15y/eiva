export declare const elasticSearchIndex: (indexParams: {
    index: string;
    body: any;
}) => Promise<void>;
export declare const receiveElasticSearchMessage: () => Promise<0 | 1 | undefined>;

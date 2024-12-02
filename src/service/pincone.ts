import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

// Initialize a client.
// API key is required, but the value does not matter.
// Host and port of the Pinecone Local instance
// is required when starting without indexes.
const pc = new Pinecone({
    apiKey: 'pclocal',
    controllerHostUrl: 'http://localhost:5080'
});


export const createIndex = async (indexName: string, dimension: number) => {
    // Create an index.
    await pc.createIndex({
        name: indexName,
        dimension,
        metric: 'dotproduct',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1'
            }
        }
    });

}

export const insert = async (indexName: string, vector: any, id: string, nameSpace: string, metadata: RecordMetadata = {}) => {
    // Get the index host
    const indexHost = (await pc.describeIndex(indexName))?.host;

    // Target the index
    const index = pc.index(indexName, 'http://' + indexHost);

    // Insert vectors
    await index.namespace(nameSpace).upsert([{
        id,
        values: vector,
        metadata
    }])
}


export const search = async (indexName: string, vector: any, nameSpace: string, k: number) => {
    // Get the index host
    const indexHost = (await pc.describeIndex(indexName))?.host;

    // Target the index
    const index = pc.index(indexName, 'http://' + indexHost);

    // Search
    const result = await index.namespace(nameSpace).query({
        vector,
        topK: k,
        includeValues: true,
        includeMetadata: true,
    });

    return result;
}

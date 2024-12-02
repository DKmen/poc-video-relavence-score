import { v1, helpers } from '@google-cloud/aiplatform'
import { config } from '../utils/config'

const { gcpProjectId, gcpLocation, gcpModelName } = config
// Create a Vertex AI client
const client = new v1.PredictionServiceClient({
    apiEndpoint: `${gcpLocation}-aiplatform.googleapis.com`,
    projectId: gcpProjectId,
    keyFilename: 'credentials.json'
});

// Make a prediction
export const generateEmbdedding = async (input: string, task = 'CLUSTERING', dimensionality = 0) => {
    const instances = input
        .split(';')
        .map(e => helpers.toValue({ content: e, task_type: task }));

    const parameters = helpers.toValue(
        dimensionality > 0 ? { outputDimensionality: dimensionality } : {}
    );

    const request = {
        endpoint: `projects/${gcpProjectId}/locations/${gcpLocation}/publishers/google/models/${gcpModelName}`,
        instances,
        parameters
    };

    const [response] = await client.predict(request as any);
    const predictions = response.predictions;

    const embeddings = predictions?.map(p => {
        const embeddingsProto = p?.structValue?.fields?.embeddings ?? {};
        const valuesProto = embeddingsProto?.structValue?.fields?.values ?? {};
        return valuesProto.listValue?.values?.map(v => parseFloat(v.numberValue + '')) ?? [];
    });

    return embeddings;
};

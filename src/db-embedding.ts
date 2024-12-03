import 'dotenv/config'

import { generateEmbdedding } from './service/vertexAi';
import { createIndex, insert } from './service/pincone';
import { SegmentRO } from './models/segment';

(async () => {
    // Create an index in the database
    await createIndex('segment-index', 768)

    // Fetch segments from the database
    const segments = await SegmentRO.query()
        .select('id', 'kvp', 'tier_1', 'tier_2', 'tier_3', 'tier_4')
        .whereNot({ 'kvp': 'sr_allvideos', 'segment_type': 'Informational' })

    // Generate embeddings for each segment and retrive relavent segments from the database
    for (let segment of segments) {
        const { id, ...segmentWithoutId } = segment;
        const embeddings = await generateEmbdedding(JSON.stringify(segmentWithoutId))

        if (!embeddings) {
            continue;
        }

        // store the embeddings in the database
        await insert('segment-index', embeddings[0], segment.id, 'nameSpace', {
            segment_id: id
        })
    }
    console.log('Done')
})()

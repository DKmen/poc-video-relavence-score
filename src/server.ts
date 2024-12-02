import 'dotenv/config'
import { generateEmbdedding } from './service/vertexAi'
import { search } from './service/pincone'
import Segment, { SegmentRO } from './models/segment'
import { MediaSegmentRO } from './models/media-segment'
import { MediaRO } from './models/media'
import MediaStatus from './types/mediaType'


const fetchRelaventSegment = async (segment: Segment, relevantScore: number) => {
    const { id, createdAt, updatedAt, ...segmentWithoutId } = segment;

    const embeddings = await generateEmbdedding(JSON.stringify(segmentWithoutId))

    if (!embeddings) {
        return;
    }

    const matchSearchResult = await search('segment-index', embeddings[0], 'nameSpace', 8)

    const segments = await Promise.all(matchSearchResult.matches.map(async (match: any) => {
        const segment = await SegmentRO.query().findById(match.metadata.segment_id || '')
        return {
            segment,
            relevantScore: ((match?.score || 0) * relevantScore) / 100
        }
    }))

    return segments
}

const fetchRelaventSegmentWithScore = async (mediaId: string) => {
    const segments = (await MediaSegmentRO.query().where('media_id', mediaId).withGraphFetched('segment').modifyGraph('segment', (builder) => {
        builder.whereNot({ 'kvp': 'sr_allvideos', 'segment_type': 'Informational' })
    }
    ).select('relevant_score').castTo<{ segment: Segment, relevantScore: number }[]>()).map(segment => ({ ...segment, relevantScore: segment.relevantScore }))

    // console.log(segments)

    const segmentsWithScore = new Map<string, { segment: Segment, relevantScore: number }[]>()

    // Generate embeddings for each segment and retrive relavent segments from the database
    for (let segment of segments) {
        if (!segment.segment) continue;

        const relaventSegments = await fetchRelaventSegment(segment.segment, segment.relevantScore) || []
        for (let relaventSegment of relaventSegments) {
            if (!relaventSegment.segment?.id) continue

            const existingSegments = segmentsWithScore.get(relaventSegment.segment.id) || [];
            segmentsWithScore.set(relaventSegment.segment.id, [...existingSegments as any, relaventSegment]);

        }
    }

    const resultSegments: { segment: Segment, relevantScore: number }[] = []

    // sort map values array by relevant score in descending order
    segmentsWithScore.forEach((value, key) => {
        // sort array by relevant score in descending order
        const sortedArray = value.sort((a, b) => b.relevantScore - a.relevantScore)

        //push the first element to the result array
        resultSegments.push(sortedArray[0])

        // update the map with the sorted array
        segmentsWithScore.set(key, sortedArray)
    })

    return resultSegments
}

const calculateRelaventScoreBasedOnSegment = async (baseMediaId: string, compareMediaId: string) => {
    // fetch relavent segments with score for base media
    const baseMediaSegments = await fetchRelaventSegmentWithScore(baseMediaId)
    const compareMediaSegments = await fetchRelaventSegmentWithScore(compareMediaId)

    // find the common segments between the two media
    const commonSegments = baseMediaSegments.filter(baseMediaSegment => compareMediaSegments.some(compareMediaSegment => compareMediaSegment.segment.id === baseMediaSegment.segment.id))

    // calculate the score based on the common segments
    const score = commonSegments.reduce((acc, segment) => {
        const baseMediaSegment = baseMediaSegments.find(baseMediaSegment => baseMediaSegment.segment.id === segment.segment.id) as { segment: Segment, relevantScore: number }
        const compareMediaSegment = compareMediaSegments.find(compareMediaSegment => compareMediaSegment.segment.id === segment.segment.id) as { segment: Segment, relevantScore: number }

        const score = (1 - Math.abs(baseMediaSegment.relevantScore - compareMediaSegment.relevantScore))

        return acc + score
    }, 0)

    console.log(baseMediaId, compareMediaId)

    return score / baseMediaSegments.length * 100
}

const calculateRelaventScoreOfFirstNMedia = async (n: number) => {
    const media = await MediaRO.query().select('id').where('status', MediaStatus.completed).limit(n + 1)

    const baseMedia = media[50]
    const compareMedia = media.slice(51)

    for (let media of compareMedia) {
        try {
            console.log(await calculateRelaventScoreBasedOnSegment(baseMedia.id, media.id))
            await new Promise(resolve => setTimeout(resolve, 15000))
        } catch (error) {
            console.log(error)
            await new Promise(resolve => setTimeout(resolve, 30000))

        }
    }
}

calculateRelaventScoreOfFirstNMedia(100)
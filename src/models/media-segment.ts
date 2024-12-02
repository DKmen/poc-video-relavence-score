import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Segment from './segment'
const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaSegment extends Model {
  mediaId!: string
  segmentId!: string
  relevantScore!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_segment'
  static override idColumn = ['media_id', 'segment_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      segmentId: { type: 'string', minLength: 36, maxLength: 36 },
      relevantScore: { type: 'number' }
    }
  }

  static override relationMappings = {
    segment: {
      relation: Model.BelongsToOneRelation,
      modelClass: Segment,
      join: {
        from: 'media_segment.segment_id',
        to: 'segment.id'
      }
    }
  }

  override $beforeInsert (): void {
    this.createdAt = formatToDBTimestamp(new Date())
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  override $beforeUpdate (): void {
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  static override get columnNameMappers (): ColumnNameMappers {
    return snakeCaseMappers()
  }
}

export const MediaSegmentRW = MediaSegment.bindKnex(knexWrite)
export const MediaSegmentRO = MediaSegment.bindKnex(knexReadOnly)

export default MediaSegment

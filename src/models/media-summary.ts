import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import type MediaSummaryStatus from '../types/mediaSymmaryStatus'
import { formatToDBTimestamp } from '../utils/helpers'
const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaSummary extends Model {
  mediaId!: string
  analysisStatus!: MediaSummaryStatus
  segmentationStatus!: MediaSummaryStatus
  data!: Record<string, unknown>
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_summary'
  static override idColumn = ['media_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      analysisStatus: { type: 'string', enum: ['PROCESSING', 'COMPLETED', 'FAILED'] },
      segmentationStatus: { type: 'string', enum: ['PROCESSING', 'COMPLETED', 'FAILED'] },
      data: { type: 'object' }
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

export const MediaSummaryRW = MediaSummary.bindKnex(knexWrite)
export const MediaSummaryRO = MediaSummary.bindKnex(knexReadOnly)

export default MediaSummary

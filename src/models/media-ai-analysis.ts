import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import MediaAiStatus from '../types/mediaAiStatus'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaAiAnalysis extends Model {
  mediaId!: string
  partNumber!: number
  data!: string
  analysisStatus!: MediaAiStatus
  segmentationStatus!: MediaAiStatus
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_ai_analysis'
  static override idColumn = 'media_id'

  static override jsonSchema = {
    type: 'object',
    required: ['mediaId', 'partNumber', 'status'],
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      partNumber: { type: 'integer' },
      data: { type: 'string' },
      analysisStatus: { type: 'string', enum: Object.values(MediaAiStatus) },
      segmentationStatus: { type: 'string', enum: Object.values(MediaAiStatus) },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' }
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

export const MediaAiAnalysisRW = MediaAiAnalysis.bindKnex(knexWrite)
export const MediaAiAnalysisRO = MediaAiAnalysis.bindKnex(knexReadOnly)

export default MediaAiAnalysis

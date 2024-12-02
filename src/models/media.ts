import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import type DocumentTypes from '../types/documentType'
import MediaStatus from '../types/mediaType'
import { formatToDBTimestamp } from '../utils/helpers'
import AgencyMedia from './agency-media'
import MediaAiAnalysis from './media-ai-analysis'
import MediaAttribute from './media-attribute'
import MediaGenre from './media-genre'
import MediaIris from './media-iris'
import MediaPlatform from './media-platform'
import MediaSegment from './media-segment'
import MediaSummary from './media-summary'
import MediaTag from './media-tag'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Media extends Model {
  id!: string
  name!: string
  type!: DocumentTypes
  filePath!: string
  metadata!: Record<string, unknown>
  status!: MediaStatus
  isLocked!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      name: { type: 'string', maxLength: 255 },
      type: { type: 'string', enum: ['image', 'video', 'document', 'youtube'] },
      status: { type: 'string', enum: Object.values(MediaStatus) },
      filePath: { type: 'string' },
      metadata: { type: 'object' }
    }
  }

  static override relationMappings = {
    agencyMedia: {
      relation: Model.HasOneRelation,
      modelClass: AgencyMedia,
      join: {
        from: 'media.id',
        to: 'agency_media.media_id'
      }
    },
    attribute: {
      relation: Model.HasOneRelation,
      modelClass: MediaAttribute,
      join: {
        from: 'media.id',
        to: 'media_attribute.media_id'
      }
    },
    mediaTag: {
      relation: Model.HasManyRelation,
      modelClass: MediaTag,
      join: {
        from: 'media.id',
        to: 'media_tag.media_id'
      }
    },
    mediaGenre: {
      relation: Model.HasManyRelation,
      modelClass: MediaGenre,
      join: {
        from: 'media.id',
        to: 'media_genre.media_id'
      }
    },
    mediaPlatform: {
      relation: Model.HasManyRelation,
      modelClass: MediaPlatform,
      join: {
        from: 'media.id',
        to: 'media_platform.media_id'
      }
    },
    iris: {
      relation: Model.HasOneRelation,
      modelClass: MediaIris,
      join: {
        from: 'media.id',
        to: 'media_iris.media_id'
      }
    },
    mediaAiAnalysis: {
      relation: Model.HasOneRelation,
      modelClass: MediaAiAnalysis,
      join: {
        from: 'media.id',
        to: 'media_ai_analysis.media_id'
      }
    },
    mediaSummary: {
      relation: Model.HasOneRelation,
      modelClass: MediaSummary,
      join: {
        from: 'media.id',
        to: 'media_summary.media_id'
      }
    },
    mediaSegment: {
      relation: Model.HasManyRelation,
      modelClass: MediaSegment,
      join: {
        from: 'media.id',
        to: 'media_segment.media_id'
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

export const MediaRW = Media.bindKnex(knexWrite)
export const MediaRO = Media.bindKnex(knexReadOnly)

export default Media

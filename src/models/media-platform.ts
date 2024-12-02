import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Platform from './platform'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaPlatform extends Model {
  mediaId!: string
  platformId!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_platform'
  static override idColumn = ['media_id', 'platform_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      platformId: { type: 'integer' }
    }
  }

  static override relationMappings = {
    platform: {
      relation: Model.BelongsToOneRelation,
      modelClass: Platform,
      join: {
        from: 'media_platform.platform_id',
        to: 'platform.id'
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

export const MediaPlatformRW = MediaPlatform.bindKnex(knexWrite)
export const MediaPlatformRO = MediaPlatform.bindKnex(knexReadOnly)

export default MediaPlatform

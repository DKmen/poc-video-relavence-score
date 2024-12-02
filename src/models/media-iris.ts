import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaIris extends Model {
  id!: string
  title!: string
  description!: string
  metadata!: Record<string, unknown>
  mediaId!: string
  irisId!: string | null
  enrichmentId!: string | null
  billingId!: string | null
  error!: Record<string, unknown>
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_iris'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      title: { type: 'string', maxLength: 255 },
      description: { type: 'string' },
      error: { type: 'object' },
      metadata: { type: 'object' },
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      irisId: { type: ['string', 'null'] },
      enrichmentId: { type: ['string', 'null'] },
      billingId: { type: ['string', 'null'] }
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

export const MediaIrisRW = MediaIris.bindKnex(knexWrite)
export const MediaIrisRO = MediaIris.bindKnex(knexReadOnly)

export default MediaIris

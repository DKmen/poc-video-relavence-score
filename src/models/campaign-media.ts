import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Media from './media'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class CampaignMedia extends Model {
  campaignId!: string
  mediaId!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'campaign_media'
  static override idColumn = ['campaign_id', 'media_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      campaignId: { type: 'string', minLength: 36, maxLength: 36 },
      mediaId: { type: 'string', minLength: 36, maxLength: 36 }
    }
  }

  static override relationMappings = {
    media: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'campaign_media.mediaId',
        to: 'media.id'
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

export const CampaignMediaRW = CampaignMedia.bindKnex(knexWrite)
export const CampaignMediaRO = CampaignMedia.bindKnex(knexReadOnly)

export default CampaignMedia

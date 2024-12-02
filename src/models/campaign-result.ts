import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Media from './media'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class CampaignResult extends Model {
  id!: string
  campaignId!: string
  publisherMediaId!: string
  advertiserMediaId!: string
  chapterNumber!: number
  adBreak!: number
  relavance!: number
  proximity!: number
  relavanceInfo!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'campaign_result'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      campaignId: { type: 'string', minLength: 36, maxLength: 36 },
      publisherMediaId: { type: 'string', minLength: 36, maxLength: 36 },
      advertiserMediaId: { type: 'string', minLength: 36, maxLength: 36 },
      chapterNumber: { type: 'number' },
      adBreak: { type: 'number' },
      relavance: { type: 'number' },
      proximity: { type: 'number' },
      relavanceInfo: { type: 'string', minLength: 1 }
    }
  }

  static override relationMappings = {
    advertiserMedia: {
      relation: Model.HasOneRelation,
      modelClass: Media,
      join: {
        from: 'campaign_result.advertiser_media_id',
        to: 'media.id'
      }
    },
    publisherMedia: {
      relation: Model.HasOneRelation,
      modelClass: Media,
      join: {
        from: 'campaign_result.publisher_media_id',
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

export const CampaignResultRW = CampaignResult.bindKnex(knexWrite)
export const CampaignResultRO = CampaignResult.bindKnex(knexReadOnly)

export default CampaignResult

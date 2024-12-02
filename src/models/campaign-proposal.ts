import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Campaign from './campaign'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class CampaignProposal extends Model {
  id!: string
  campaignId!: string
  segment!: string[]
  result!: Array<Record<string, unknown>>
  reach!: number
  relevance!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'campaign_proposal'

  static override jsonSchema = {
    type: 'object',
    properties: {
      campaignId: { type: 'string', minLength: 36, maxLength: 36 },
      segment: { type: 'array', items: { type: 'string' } },
      result: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', minLength: 36, maxLength: 36 },
            videoTitle: { type: 'string' },
            videoUrl: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            duration: { type: 'integer' },
            start: { type: 'number' },
            end: { type: 'number' },
            adBreak: { type: 'string' },
            relevance: { type: 'number' },
            confidence: { type: 'string' },
            reach: { type: 'integer' }
          }
        }
      },
      reach: { type: 'number' },
      relevance: { type: 'number' }
    }
  }

  static override relationMappings = {
    campaign: {
      relation: Model.BelongsToOneRelation,
      modelClass: Campaign,
      join: {
        from: 'campaign_proposal.campaign_id',
        to: 'campaign.id'
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

export const CampaignProposalRW = CampaignProposal.bindKnex(knexWrite)
export const CampaignProposalRO = CampaignProposal.bindKnex(knexReadOnly)

export default CampaignProposal

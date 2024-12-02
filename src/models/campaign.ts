import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import CampaignStatus from '../types/campaignStatus'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Campaign extends Model {
  id!: string
  agencyId!: string
  name!: string
  status!: CampaignStatus
  createdBy!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'campaign'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      agencyId: { type: 'string', minLength: 36, maxLength: 36 },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      status: { type: 'string', enum: Object.values(CampaignStatus) },
      createdBy: { type: 'string', minLength: 36, maxLength: 36 }
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

export const CampaignRW = Campaign.bindKnex(knexWrite)
export const CampaignRO = Campaign.bindKnex(knexReadOnly)

export default Campaign

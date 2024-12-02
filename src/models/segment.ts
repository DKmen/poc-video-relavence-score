import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Segment extends Model {
  id!: string
  segmentType!: string
  kvp!: string | null
  tier1!: string | null
  tier2!: string | null
  tier3!: string | null
  tier4!: string | null
  createdAt!: string
  updatedAt!: string

  static override tableName = 'segment'

  static override jsonSchema = {
    type: 'object',
    required: ['segmentType'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      segmentType: { type: 'string', minLength: 1, maxLength: 255 },
      kvp: { type: ['string', 'null'], maxLength: 255 },
      tier1: { type: ['string', 'null'], maxLength: 255 },
      tier2: { type: ['string', 'null'], maxLength: 255 },
      tier3: { type: ['string', 'null'], maxLength: 255 },
      tier4: { type: ['string', 'null'], maxLength: 255 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  }

  override $beforeInsert (): void {
    const now = formatToDBTimestamp(new Date())
    this.createdAt = now
    this.updatedAt = now
  }

  override $beforeUpdate (): void {
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  static override get columnNameMappers (): ColumnNameMappers {
    return snakeCaseMappers()
  }
}

export const SegmentRW = Segment.bindKnex(knexWrite)
export const SegmentRO = Segment.bindKnex(knexReadOnly)

export default Segment

import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers'
import { writeConfig, readOnlyConfig } from '../knexfile'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class User extends Model {
  id!: string
  firstName!: string | null
  lastName!: string | null
  email!: string
  createdAt!: string
  updatedAt!: string
  roles!: ['admin']

  static override tableName = 'user'

  static override jsonSchema = {
    type: 'object',
    required: ['email'],
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      firstName: { type: ['string', 'null'], maxLength: 255 },
      lastName: { type: ['string', 'null'], maxLength: 255 },
      email: { type: 'string', maxLength: 255 },
      role: { type: 'array', items: { type: 'string' } }
    }
  }

  override $beforeInsert (): void {
    this.createdAt = formatToDBTimestamp(new Date())
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  override $beforeUpdate (): void {
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  override $formatJson (data: Record<string, unknown>): Record<string, unknown> {
    const json = super.$formatJson(data)
    return json
  }

  static override get columnNameMappers (): ColumnNameMappers {
    return snakeCaseMappers()
  }
}

export const UserRW = User.bindKnex(knexWrite)
export const UserRO = User.bindKnex(knexReadOnly)

export default User

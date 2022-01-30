import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Dispatches extends BaseSchema {
  protected tableName = 'dispatches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().index()
      table.string('type').notNullable()
      table.string('title').nullable()
      table.json('data').notNullable()

      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
        .nullable()

      table
        .integer('wpp_phone_id')
        .unsigned()
        .references('id')
        .inTable('wpp_phones')
        .onDelete('CASCADE')
        .nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

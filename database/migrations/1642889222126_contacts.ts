import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Contacts extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('phone_number').nullable()
      table.boolean('has_whatsapp').nullable()
      table.string('name').nullable()

      table.json('data').nullable()

      table
        .integer('person_info_id')
        .unsigned()
        .references('id')
        .inTable('person_infos')
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

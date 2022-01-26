import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PersonInfos extends BaseSchema {
  protected tableName = 'person_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name').nullable()
      table.string('second_name').nullable()
      table.string('cpf').nullable()

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

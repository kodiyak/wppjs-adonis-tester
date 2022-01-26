import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersOrganizations extends BaseSchema {
  protected tableName = 'users_organizations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
        .notNullable()
      table.string('nivel').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

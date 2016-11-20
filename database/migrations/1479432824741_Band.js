'use strict'

const Schema = use('Schema')

class BandSchema extends Schema {

  up () {
    this.create('bands', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name', 80)
      table.string('avatar', 90)
      table.string('genre', 50)
      table.string('page', 80)
      table.string('members', 100)
      table.string('description', 400)
      table.timestamps()
    })
  }

  down () {
    this.drop('bands')
  }

}

module.exports = BandSchema

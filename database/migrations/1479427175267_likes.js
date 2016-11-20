'use strict'

const Schema = use('Schema')

class LikesSchema extends Schema {

  up () {
    this.create('likes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('band_id').unsigned().references('id').inTable('bands')
      table.timestamps()
    })
  }

  down () {
    this.drop('likes')
  }

}

module.exports = LikesSchema

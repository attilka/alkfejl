'use strict'

const Lucid = use('Lucid')

class Band extends Lucid {
    user(){
        return this.belongsTo('App/Model/User');
    }

    events(){
        return this.hasMany('App/Model/Event');
    }
}

module.exports = Band

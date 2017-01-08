'use strict'

const Lucid = use('Lucid')
const Like = use('App/Model/Like')

class Band extends Lucid {
    user(){
        return this.belongsTo('App/Model/User');
    }

    events(){
        return this.hasMany('App/Model/Event');
    }

    * likedBy(user_id){
        const like=yield Like.query().where('user_id',user_id).where('band_id',this.id).first()
        return like ? true : false;
    }
}

module.exports = Band

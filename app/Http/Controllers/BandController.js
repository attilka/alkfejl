'use strict'

const Band = use('App/Model/Band')
const User = use('App/Model/User')
const Like = use('App/Model/Like')
const Validator = use('Validator')

class BandController {

    * edit (request, response) {
    const band = yield Band.findBy('user_id', request.currentUser.id)

    if (band == null) {
      response.unauthorized('Access denied.')
      return
    }

    yield response.sendView('bandEdit', {
      band: band.toJSON()
    });
  }

  * doEdit (request, response) {
    const bandData = request.except('_csrf');

    const rules = {
      name: 'required'
    };

    const validation = yield Validator.validateAll(bandData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    const band = yield Band.findBy('user_id', request.currentUser.id)
    
    band.name = bandData.name;
    band.genre = bandData.genre;
    band.page = bandData.page;
    band.members = bandData.members;
    band.description = bandData.description;

    yield band.save()
    
    response.redirect('/')
  }

  * search (request, response) {
    const page = Math.max(1, request.input('p'))
    const name = request.input('bandName') || ''

    const bands = yield Band.query()
      .where('name','LIKE','%'+name+'%')
      .paginate(page, 9)

    yield response.sendView('bandSearch', {
      bands: bands.toJSON(),
      bandName: name
    })
  }

  * show (request, response) {
    const id = request.param('id');
    const band = yield Band.find(id);

    const likes = yield Like.query().where('user_id', request.currentUser.id).where('band_id',id).first();

    if (likes) band.likes=1

    yield response.sendView('bandShow', {
      band: band.toJSON()
    })
  }

  * like(request, response){
      const id = request.param('id');

      const likes = yield Like.query().where('user_id', request.currentUser.id).where('band_id',id).first();
      if (likes)
        yield likes.delete()
      else
        yield Like.create({band_id: id, user_id: request.currentUser.id})

        response.redirect('/bands/'+id)

  }

}

module.exports = BandController

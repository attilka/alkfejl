'use strict'

const Helpers = use('Helpers')
const Band = use('App/Model/Band')
const User = use('App/Model/User')
const Like = use('App/Model/Like')
const Validator = use('Validator')
const Event = use('App/Model/Event')
const EventController = use('App/Http/Controllers/EventController')

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

  * delete (request, response) {
    const band = yield Band.findBy('user_id', request.currentUser.id)
    

    if (band == null) {
      response.unauthorized('Access denied.')
      return
    }

    const events = yield Event.query().where('band_id', band.id).fetch()

    for (let e of events){
      yield e.deleteEvent()
    }
 

    const likes = yield Like.query().where('band_id', band.id).fetch()

    for (let like of likes){
      yield like.delete()
    }

    yield band.delete();
    yield request.currentUser.delete();

    response.redirect('/logout')
  }

  * search (request, response) {
    const page = Math.max(1, request.input('p'))
    const name = request.input('bandName') || ''

    const bands = yield Band.query()
      .where('name','LIKE','%'+name+'%')
      .orderBy('name')
      .paginate(page, 12)

      for (let band of bands){
        band.liked=yield band.likedBy(request.currentUser.id)
      }

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

  * doUpdateAvatar (request, response) {
    const avatar = request.file('avatar', {
        maxSize: '2mb',
        allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    const band = yield Band.findBy('user_id', request.currentUser.id)
    const fileName = `${band.id}.${avatar.extension()}`

    yield avatar.move(Helpers.publicPath()+'/avatars/', fileName)
    if (!avatar.moved()) {
      response.badRequest(avatar.errors())
      return
    }
    band.avatar = fileName;
    yield band.save()
    response.redirect('/')
  }

  * updateAvatar (request, response) {
    yield response.sendView('updateAvatar')
  }

  * ajaxLike(request, response){
      const id = request.post().band_id;
      const user_id = request.post().user_id;
      var resp = 'liked'

      const likes = yield Like.query().where('user_id', user_id).where('band_id',id).first();
      if (likes){
        yield likes.delete()
        resp='not-liked'
      }  
      else
        yield Like.create({band_id: id, user_id: user_id})

      response.ok({
          success:true,
          resp: resp
      })
  }


}

module.exports = BandController

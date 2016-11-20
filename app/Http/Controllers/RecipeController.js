'use strict'

const Database = use('Database')
const Band = use('App/Model/Band')
const User = use('App/Model/User')
const Validator = use('Validator')

class RecipeController {

  * index(request, response) {
    // const categories = yield Database.from('categories').select('*');
    // response.send(categories)

    const categories = yield Band.all()

    /*for(let category of categories) {
      const recipes = yield category.recipes().limit(3).fetch();
      category.topRecipes = recipes.toJSON();
    }*/

    yield response.sendView('main', {
      categories: categories.toJSON()
    })  
  }

  * create (request, response) {
    const categories = yield Category.all()
    yield response.sendView('recipeCreate', {
      categories: categories.toJSON()
    });
  }

  * doCreate (request, response) {
    const recipeData = request.except('_csrf');

    const rules = {
      name: 'required',
      ingredients: 'required',
      instructions: 'required',
      category_id: 'required'
    };

    const validation = yield Validator.validateAll(recipeData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    recipeData.user_id = request.currentUser.id
    const recipe = yield Recipe.create(recipeData)
    // response.send(recipe.toJSON())
    response.redirect('/')
  }

  * edit (request, response) {
    const categories = yield Category.all()
    const id = request.param('id');
    const recipe = yield Recipe.find(id);
    // console.log(recipe.toJSON())

    if (request.currentUser.id !== recipe.user_id) {
      response.unauthorized('Access denied.')
      return
    }


    yield response.sendView('recipeEdit', {
      categories: categories.toJSON(),
      recipe: recipe.toJSON()
    });
  }

  * doEdit (request, response) {
    const recipeData = request.except('_csrf');

    const rules = {
      name: 'required',
      ingredients: 'required',
      instructions: 'required',
      category_id: 'required'
    };

    const validation = yield Validator.validateAll(recipeData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    const id = request.param('id');
    const recipe = yield Recipe.find(id);

    // Object.assign(recipe, recipeData)
    
    recipe.name = recipeData.name;
    recipe.ingredients = recipeData.ingredients; 
    recipe.instructions = recipeData.instructions;
    recipe.category_id = recipeData.category_id;

    yield recipe.save()
    
    response.redirect('/')
  }

  * show (request, response) {
    const id = request.param('id');
    const recipe = yield Recipe.find(id);
    yield recipe.related('category').load();
    // response.send(recipe.toJSON())

    yield response.sendView('recipeShow', {
      recipe: recipe.toJSON()
    })
  }

  * doDelete (request, response) {
    const id = request.param('id');
    const recipe = yield Recipe.find(id);

    if (request.currentUser.id !== recipe.user_id) {
      response.unauthorized('Access denied.')
      return
    }

    yield recipe.delete()
    response.redirect('/')
  }

  * search (request, response) {
    const page = Math.max(1, request.input('p'))
    const filters = {
      recipeName: request.input('recipeName') || '',
      category: request.input('category') || 0,
      createdBy: request.input('createdBy') || 0
    }

    const recipes = yield Recipe.query()
      .where(function () {
        if (filters.category > 0) this.where('category_id', filters.category)
        if (filters.createdBy > 0) this.where('user_id', filters.createdBy)
        if (filters.recipeName.length > 0) this.where('name', 'LIKE', `%${filters.recipeName}%`)
      })
      .with('user')
      .paginate(page, 9)

    const categories = yield Category.all()
    const users = yield User.all()

    yield response.sendView('recipeSearch', {
      recipes: recipes.toJSON(),
      categories: categories.toJSON(),
      users: users.toJSON(),
      filters
    })
  }

}

module.exports = RecipeController

'use strict';

const AuthModel = require('../models/auth-model'),
      errors = require('../middlewares/errors'),
      am = new AuthModel();

class AuthController {
  index(req, res, next){
    if(req.session.username){
      res.redirect('/teams');
    } else {
      res.render('login-form', {
        title: 'Autenticacion de Usuarios',
        message: req.query.message
      });
    }
  }

  logInGet(req, res, next){
    res.redirect('/')
  }

  logInPost(req, res, next){
    let user = {
      username: req.body.username,
      password: req.body.password
    };

    am.getUser(user, (docs) => {
      req.session.username = ( docs != null) ? user.username : null;
      
      return (req.session.username) 
          ? res.redirect('/teams') 
          : errors.http404(req, res, next);
    });
  }

  signInGet(req, res, next){
    res.render('signin-form', { title: 'Registro de Usuarios' });
  }

  signInPost(req, res, next){
    let user = {
      user_id: 0,
      username: req.body.username,
      password: req.body.password
    };

    am.setUser(user, (docs) => {
      res.redirect(`/?message=El usuario ${user.username} ha sido creado.`);
    });
  }

  logOut(req, res, next){
    req.session.destroy((err) => {
      return (err) 
          ? errors.http500(req, res, next)
          : res.redirect('/');
    });
  }
}

module.exports = AuthController;
'use strict'
var bcrypt = require('bcrypt-nodejs');
var User= require('../models/user');
function pruebas(req,res){
  res.status(200).send({message:'control rawr'});
}

function saveUser(req,res){
  var user =new User();
  var param = req.body;
  console.log(param);
  user.name = param.name;
  user.surname = param.surname;
  user.email = param.email;
  // user.role = param.name;
  user.role = 'ROLE_USER';
  user.image='null';
  if (param.password) {
    // ENCRIPTAR PASSWORD Y GUARDAR CONTRASENA
    bcrypt.hash(param.password,null,null,function(err,hash){
      // console.log(hash);
      user.password =hash;
      if (user.name != null && user.surname != null && user.email != null) {
        // SAVE USER
          user.save((err,userStored) => {
            if (err) {
              res.status(500).send({message:'error al guardar el usuario'});

            } else {
              if (!userStored) {
                res.status(404).send({message:'No se registro el usuario'});

              } else {
                res.status(200).send({user: userStored});

              }
            }
          });
      } else {
        res.status(200).send({message:'rellena todos los campos'});
      }

    });
  }else {
    res.status(200).send({message:'introduce la CONTRASENA'});
  }


}
function loginUser(req,res){
  var param = req.body;
  var email = param.email;
  var password = param.password;
User.findOne({email: email.toLowerCase()},(err,user)=>{
  if (err) {
    res.status(500).send({message:'Error en la peticion'});

  }else {
    if (!user) {
      res.status(404).send({message:'Error el usuario no existe'});

    }else {
      // COMPROBAR CONTRAENA
      bcrypt.compare(password,user.password,function(err,check){
        console.log(user);
        console.log(password);
        if (check) {
          // DEVOLVER LOS DATOS DEL USUARIO
          if (param.gethash) {
          // DEVOLVER TOKEN

          }else {
            res.status(200).send({user});

          }
        }else {
          res.status(404).send({message:'Error: Datos incorrectos o no existen'});

        }
      });
    }
  }
});

}



module.exports ={
  pruebas,
  saveUser,
  loginUser
};

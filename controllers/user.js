'use strict'
var fs= require('fs');
var path= require('path');
var bcrypt = require('bcrypt-nodejs');
var User= require('../models/user');
var jwt= require('../services/jwt');

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
        // console.log(user);
        // console.log(password);
        if (check) {
          // DEVOLVER LOS DATOS DEL USUARIO
          if (param.gethash) {
          // DEVOLVER TOKEN
          res.status(200).send({
            token:jwt.createToken(user)
          });

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

function updateUser(req,res) {
  var userId =req.params.id;
  // var userId2 =req.params.id;
  // console.log(userId);
  // console.log(userId2);
  var update =req.body;
  User.findByIdAndUpdate(userId,update,(err,userUpdate)=>{
    if (err) {
      res.status(500).send({message:'Error al actualizar el usuario'});

    } else {
      if (!userUpdate) {
        res.status(404).send({message:'Error: no existe el usuario'});

      }else{
        res.status(200).send({user:userUpdate});

      }
    }
  });
}

function uploadImage(req,res) {
  var userId =req.params.id;
  var file_name= 'no subido';
  if (req.files) {
    var file_path= req.files.image.path;
    var file_split= file_path.split('\\');
    var file_name= file_split[2];
    var ex_split= file_path.split('\.');
    var file_ext= ex_split[1];
    if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg') {
      console.log(file_name);
      User.findByIdAndUpdate(userId,{image: file_name}, (err,userUpdate) =>{
        if (!userUpdate) {
          res.status(404).send({message:'Error: no se ha podido actualizar el usuario'});

        }else{
          res.status(200).send({user:userUpdate});

        }
      });
    } else {
      res.status(200).send({message:'Error: extension no valida'});

    }
  } else {
    res.status(200).send({message:'Error: no existe imagen'});

  }
}

function getImageFile(req,res){
  var imageFile = req.params.imageFile;
  fs.exists('./uploads/users/'+imageFile, function(exists){
    if (exists) {
      res.sendFile(path.resolve('./uploads/users/'+imageFile));
    } else {
      res.status(200).send({message:'Error: no existe imagen'});
    }
  });
}


module.exports ={
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile,
};

'use strict'
var path= require('path');
var fs= require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
  var artistId = req.params.id;
  Artist.findById(artistId,(err,artist)=>{
    if (err) {
      res.status(500).send({message:'Error en la peticion.'+err});

    } else {
      if (!artist) {
        res.status(404).send({message:'El artista no existe'});

      }else{
        res.status(200).send({artist});

      }
    }
  });
    // res.status(200).send({message:'artist rawr'});
}

function saveArtist(req,res) {
   var artist =new Artist();
   var params =req.body;
   artist.name=params.name;
   artist.description=params.description;
   artist.image='null';
   artist.save((err,artistStored) =>{
     if (err) {
       res.status(500).send({message: 'Error al guardar el artista'});
     }else {
       if (!artistStored) {
         res.status(404).send({message: 'Error: el artista no ha sido guardado'});

       } else {
         res.status(200).send({artist:artistStored});
       }
     }
   });

 }

 function getArtists(req,res) {
   if (true) {
     var page = req.params.page;
   }else {
     var page =1;
   }
   var itemsPerPage=3;
   Artist.find().sort('name').paginate(page,itemsPerPage, (err,artists,total) =>{
     if (err) {
       res.status(500).send({message: 'Error en la peticion'});

     } else {
       if (!artists) {
         res.status(404).send({message: 'Error: artistas no encontrados'});

       } else {
         return res.status(200).send({
            total_items:total,
            artists:artists
         });
       }
     }
   });
 }

 function updateArtist(req,res) {
   var artistsId = req.params.id;
   var update = req.body;
   Artist.findByIdAndUpdate(artistsId,update,(err,artistUpdated)=>{
     if (err) {
       res.status(500).send({message: 'Error en la peticion'});

     } else {
       if (!artistUpdated) {
         res.status(404).send({message: 'Error: No se actualizo el aritsta'});

       } else {
         res.status(200).send({artist:artistUpdated});
       }
     }
   });
 }
 function deleteArtist(req,res) {
   var artistsId = req.params.id;
   Artist.findByIdAndRemove(artistsId,(err,artistRemoved)=>{
     if (err) {
       res.status(500).send({message: 'Error al eliminar el artista'});

     } else {
       if (!artistRemoved) {
         res.status(404).send({message: 'Error: No se borro el aritsta'});

       } else {
        //  res.status(404).send({artistRemoved});
        //  console.log(artistRemoved);
         Album.find({artist:artistRemoved._id}).remove((err,albumRemoved)=>{
           if (err) {
             res.status(500).send({message: 'Error al eliminar el album'});

           } else {
             if (!albumRemoved) {
               res.status(404).send({message: 'Error: No se borro el album'});

             } else {
              //  res.status(404).send({artistRemoved});
               console.log(albumRemoved);
                 Album.find({artist:artistRemoved._id}).remove((err,albumRemoved)=>{
                   if (err) {
                     res.status(500).send({message: 'Error al eliminar el album'});

                   } else {
                     if (!albumRemoved) {
                       res.status(404).send({message: 'Error: No se borro el album'});

                     } else {
                      //  res.status(404).send({artistRemoved});
                       console.log(albumRemoved);
                       Song.find({album:albumRemoved._id}).remove((err,songRemoved)=>{
                         if (err) {
                           res.status(500).send({message: 'Error al eliminar el track'});

                         } else {
                           if (!albumRemoved) {
                             res.status(404).send({message: 'Error: No se borro el track'});

                           } else {
                              res.status(200).send({artist:artistRemoved});
                           }
                         }
                       });

                     }
                   }
                 });

             }
           }
         });

       }
     }
   });

 }
module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist
};

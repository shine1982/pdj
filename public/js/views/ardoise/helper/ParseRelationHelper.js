app.parseRelationHelper ={};
app.parseRelationHelper.addToList = function ( //cette méthode est pour ajouter un element dans referentiel & dans la relation
    objParent,
    nameOfRelation,
    itemLabel,
    itemPrice,
    itemParseObject,
    collectionModel,
    callbackSuccess,
    callbackError,
    idDishesBloc){

    var self = this;
    //d'abord search dans la liste existant
    var item = collectionModel.find(function(obj){
        return obj.get("label")===itemLabel;
    });
    if(item){//trouvé
        return callbackError(1);//already dans la liste (relation)
    }else{
        //maintenant chercher si dans referentiel
        var query =  new Parse.Query(itemParseObject);
        query.equalTo("resto", app.resto);
        query.equalTo("label",itemLabel);
        if(idDishesBloc){
            query.equalTo("idDishesBloc", idDishesBloc);
        }
        query.find().then(function(results){
            if(results.length>0){
                var itemFromDB = results[0];
                collectionModel.add(itemFromDB);
                self.updateRelationFromList(objParent,nameOfRelation,collectionModel,idDishesBloc);
                if(typeof callbackSuccess === "function"){
                    callbackSuccess(itemFromDB);
                }
            }else{
                var itemToAddToDB = new itemParseObject;
                itemToAddToDB.set("label",itemLabel);
                if(itemPrice){
                    itemToAddToDB.set("priceEuro",itemPrice);
                }
                itemToAddToDB.set("resto",app.resto);
                if(idDishesBloc){//une ligne spécifique pour gestion de plat
                    itemToAddToDB.set("idDishesBloc",idDishesBloc);
                }
                itemToAddToDB.set("order",collectionModel.getNextOrder());
                itemToAddToDB.save().then(
                    function(itemToAddToDB){
                        collectionModel.add(itemToAddToDB);
                        self.updateRelationFromList(objParent,nameOfRelation,collectionModel,idDishesBloc);
                        if(typeof callbackSuccess === "function"){
                            callbackSuccess(itemToAddToDB);
                        }
                    }
                )
            }
        })
    }
 }
app.parseRelationHelper.updateRelationFromList=function(objParent, relationName, collectionModel,idDishesBloc){
    var relation = objParent.relation(relationName);
    var query  = relation.query();
    if(idDishesBloc){//une ligne spécifique pour gestion de plat
        query.equalTo("idDishesBloc", idDishesBloc);
    }
    query.find({
        success:function(results){
            if(results!=null && results.length>0){
                relation.remove(results);
            }
            collectionModel.forEach (function (model) {
                relation.add(model);
            });
            objParent.save();
        },
        error:function(err){
            alert("Erreur de sauvegarde. Détail: "+err.message);
        }
    })
}

app.parseRelationHelper.deleteItemFromRelation=function(objParent, relationName, collectionModel, item, idDishesBloc){
    var relation = objParent.relation(relationName);
    var query = relation.query();
    if(idDishesBloc){//une ligne spécifique pour gestion de plat
        query.equalTo("idDishesBloc", idDishesBloc);
    }
    query.find({
        success:function(results){
            if(results!=null && results.length>0){
                relation.remove(item);
            }
            objParent.save();
            collectionModel.remove(item);
        },
        error:function(err){
            alert("Erreur de delete. Détail: "+err.message);
        }
    })
}

app.parseRelationHelper.setListFromRelation=function(objParent, relationName, collectionModel){
    var relation = objParent.relation(relationName);
    relation.query().ascending("order").find({
        success:function(results){
            collectionModel.add(results);
        },
        error:function(err){
            alert("Erreur de chargement de liste. Détail: "+err.message);
        }
    })
}
app.parseRelationHelper.synchroniseDishList=function(){//synchroniser la dishList de ardoise avec celles de dishesBloc
    app.resto.ardoiseOfDate.dishList.reset();
    app.resto.ardoiseOfDate.dishesBlocList.forEach(function(dishesBloc){
        app.resto.ardoiseOfDate.dishList.add(dishesBloc.dishList.toArray());
    })

}

app.parseRelationHelper.saveRelationFromList=function(objParent, list, nomOfRelation){
    var relation = objParent.relation(nomOfRelation);
    list.forEach (function (model) {
        relation.add(model);
    });
}
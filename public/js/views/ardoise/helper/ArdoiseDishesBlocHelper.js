//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseDishesBlocHelper(context){
    this.ctx = context;

    this.initDishesBlocListFromZero=function(callback){

        var queryArdoiseDishesBloc = new Parse.Query(app.ArdoiseDishesBloc);
        queryArdoiseDishesBloc.ascending("order");
        queryArdoiseDishesBloc.equalTo("resto",app.resto);
        queryArdoiseDishesBloc.limit(3);
        queryArdoiseDishesBloc.find().then(function(list){
            if(list.length === 0){
                var labelArrays = ["Entrées","Plats", "Desserts"];
                Parse.Promise.as().then(function() {

                    var promises = [];
                    var order=1;
                    _.each(labelArrays, function(label) {
                        var db = new app.ArdoiseDishesBloc();
                        db.set("label",label);
                        db.set("resto",app.resto);
                        db.set("order",order);
                        order++;
                        app.resto.ardoiseOfDate.dishesBlocList.add(db);
                        promises.push(db.save());
                    });
                    return Parse.Promise.when(promises);

                }).then(function() {
                    callback();
                });
            }else{
                app.resto.ardoiseOfDate.dishesBlocList.add(list);
                callback();
            }

        })
    };

    this.addNewDishesBloc=function(e){
        e.preventDefault();
        var label = this.ctx.$(".addDishesBlocLabelInput").val();
        var that = this;
        if(label!==''){
            app.parseRelationHelper.addToList(
                app.resto.ardoiseOfDate,
                app.constants.RELATION_DISHES_BLOC_LIST,
                label,
                0,
                app.ArdoiseDishesBloc,
                app.resto.ardoiseOfDate.dishesBlocList,
                function(item){
                    that.ctx.$(".addDishesBlocLabelInput").val('');
                },
                function(errNo){
                    if(errNo ===1){
                        alert("'"+label+"' déjà dans la liste!");
                    }
                }
            );
        }else{
            alert("vous devez saisir le nom du bloc!");
        }
    };
    this.showAddNewDishesBloc=function(e){
        e.preventDefault();
        this.ctx.$(".showAddDishesBloc").addClass("editing");
    };
    this.hideAddNewDishesBloc=function(e){
        e.preventDefault();
        this.ctx.$(".showAddDishesBloc").removeClass("editing");
    };
    this.addDishesBloc=function(ardoiseDishesBloc){
        var ardoiseDishesBlocView = new app.ArdoiseDishesBlocView({model:ardoiseDishesBloc});
        $("#zoneDishesBlocs .showAddDishesBlocBtn").before(ardoiseDishesBlocView.render().el);
    };
}
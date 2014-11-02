//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseTextHelper(context){
    this.ctx = context;


    this.initTextListFromRelation=function(){

        var relation = app.resto.ardoiseOfDate.relation("textList");
        relation.query().ascending("order").find({
            success:function(textList){
                app.resto.ardoiseOfDate.textList.add(textList);
            }
        })
    }
    this.newText=function(label, order, callback){
        this.searchText(label,
            function(text){
                callback(text);
            },
            function(){
                var model = new app.ArdoiseText();
                model.set("label",label);
                model.set("resto",app.resto);
                model.set("order",order);
                model.save().then(
                    function(model){
                        callback(model);
                    }
                )
            }
        );
    };
    this.addNewText=function(e){
        e.preventDefault();
        var label = this.ctx.$(".addTextLabelInput").val();
        var that = this;
        if(label!==''){
            this.newText(label, app.resto.ardoiseOfDate.textList.getNextOrder(), function(text){
                app.resto.ardoiseOfDate.textList.add(text);
                that.ctx.$(".addTextLabelInput").val('');
            });
        }else{
            alert("vous devez saisir le texte à ajouter!");
        }
    };

    this.addText=function(text){
        var ardoiseTextView = new app.ArdoiseTextView({model:text});
        $("#zoneTexts .addTextZone").before(ardoiseTextView.render().el);
    };
    this.searchText=function(label,success,notsuccess){

        var query =  new Parse.Query(app.ArdoiseText);
        query.equalTo("resto", app.resto);
        query.equalTo("label",label);
        query.find().then(function(results){
            if(results.length>0){
                success(results[0]);
            }else{
                notsuccess();
            }
        })
    };



}
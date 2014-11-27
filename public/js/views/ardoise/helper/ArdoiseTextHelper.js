//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseTextHelper(context){
    this.ctx = context;


    this.initTextListFromRelation=function(){
        /*
        var relation = app.resto.ardoiseOfDate.relation("textList");
        relation.query().ascending("order").find({
            success:function(textList){
                app.resto.ardoiseOfDate.textList.add(textList);
            }
        })*/
        app.parseRelationHelper.initListFromRelation(app.resto.ardoiseOfDate.textList,
        app.resto.ardoiseOfDate,
        app.constants.RELATION_TEXT_LIST);
    };
    this.addNewText=function(e){
        e.preventDefault();
        var label = this.ctx.$(".addTextLabelInput").val();
        var that = this;
        if(label!==''){
            app.parseRelationHelper.addToList(
                app.resto.ardoiseOfDate,
                app.constants.RELATION_TEXT_LIST,
                label,
                0,
                app.ArdoiseText,
                app.resto.ardoiseOfDate.textList,
                function(item){
                    that.ctx.$(".addTextLabelInput").val('');
                },
                function(errNo){
                    if(errNo ===1){
                        alert("'"+label+"' déjà dans la liste!");
                    }
                }
            );
        }else{
            alert("Vous devez saisir le texte à ajouter!");
        }
    };

    this.addText=function(text){
        var ardoiseTextView = new app.ArdoiseTextView({model:text});
        $("#zoneTexts .addTextZone").before(ardoiseTextView.render().el);
    };
}
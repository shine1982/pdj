Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoiseView = Parse.View.extend({

    template: _.template($('#ardoise-template').html()),

    events: {
        "click .addFormulePriceBtn":"addNewFormulePrice",
        "click #saveArdoiseBtn":'saveArdoise',
        "click .btnCreateArdoise":'createNewArdoise'
    },

    initialize: function() {
        _.bindAll(this,"addNewFormulePrice","saveArdoise","createNewArdoise");
        this.render();

        app.resto.ardoiseOfDate.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoiseOfDate.formulePriceList.on('add', this.addFormulePrice);

        if(this.options.modify){
            this.initFormulePriceListFromRelation();
        }
    },

    render: function() {

        this.$el.html( this.template(this.options));
        return this;
    },

    initFormulePriceListFromZero:function(callback){
            var that = this;
            var queryArdoiseFormulePrice = new Parse.Query(app.ArdoiseFormulePrice);
            queryArdoiseFormulePrice.ascending("order");
            queryArdoiseFormulePrice.equalTo("resto",app.resto);
            queryArdoiseFormulePrice.limit(3);
            queryArdoiseFormulePrice.find().then(function(list){
                if(list.length === 0){
                    var labelArrays = ["plat","entree + plat ou plat + dessert", "entree + plat + dessert"];
                    for(var i=0; i<labelArrays.length; i++){
                        that.newFormulePrice(labelArrays[i],function(afp){
                            app.resto.ardoiseOfDate.formulePriceList.add(afp);
                        })
                    }
                }else{
                    app.resto.ardoiseOfDate.formulePriceList.add(list);
                }
                callback();
            })


    },
    newFormulePrice:function(label,callback){
        var afp = new app.ArdoiseFormulePrice();
        afp.set("label",label);
        afp.set("resto",app.resto);
        afp.set("order",app.resto.ardoiseOfDate.formulePriceList.getNextOrder());
        afp.save().then(
            function(afp){
                callback(afp);
            }
        )
    },
    addNewFormulePrice:function(e){
        e.preventDefault();
        this.newFormulePrice("double cliquez-moi pour modifier!",function(afp){
            app.resto.ardoiseOfDate.formulePriceList.add(afp);
        });
    },

    initFormulePriceListFromRelation:function(){
        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        relationFPL.query().ascending("order").find({
            success:function(formulePriceList){
                app.resto.ardoiseOfDate.formulePriceList.add(formulePriceList);
            }
        })
    },

    addFormulePrice:function(ardoiseFormulePrice){
        var ardoiseFormulePriceView = new ArdoiseFormulePriceView({model:ardoiseFormulePrice});
        $("#zoneFormulePrice").append(ardoiseFormulePriceView.render().el);
    },

    createNewArdoise: function(e){

        e.preventDefault();
        var datejsForArdoise = moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
        var that = this;
        this.searchArdoise(datejsForArdoise, function(hasAlreadyArdoise){
            if(hasAlreadyArdoise){
                showMsg(3,"l'ardoise de cette date existe déjà");
            }else{
                that.options.modify=true;
                that.render();
                that.initFormulePriceListFromZero(
                    function(){
                        that.saveArdoiseToBase("Vous venez de créer votre ardoise, modifiez la dés maintenant pour adapter la réalité de votre restaurant!");
                    }
                );


            }
        })

        var ardoise = app.resto.ardoiseOfDate;
    },

    searchArdoise:function(jsDateSelected, callback){

    var queryArdoise = new Parse.Query(app.Ardoise);
    queryArdoise.equalTo("resto", app.resto);
    queryArdoise.equalTo("date",jsDateSelected);
    queryArdoise.find().then(
        function(ardoises){
            if(ardoises.length>0){
                app.resto.ardoiseOfDate =ardoises[0];//donc ardoise existe déjà, c'est une mise à jour
                callback(true);
            }else{
                callback(false);
            }
        },
        function(error){
            showMsg(3,error.message);
        });
    },


    saveArdoise:function(e){
        e.preventDefault();
        this.saveArdoiseToBase("L'ardoise a été sauvegardé pour la date "+ $('#ardoiseDatepicker').val());

    },
    saveArdoiseToBase:function(msgToShow){
        var datejsForArdoise = moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
        var ardoiseTitle = $("#ardoiseTitle").val();

        var ardoise = app.resto.ardoiseOfDate;

        ardoise.set("resto",app.resto);
        ardoise.set("date",datejsForArdoise);
        ardoise.set("title",ardoiseTitle);

        this.updateFormulePriceList(this.options.modify,function(relationFPL){
            app.resto.ardoiseOfDate.formulePriceList.forEach (function (fpl) {
                if(!fpl.toBeRemoved){
                    relationFPL.add(fpl);
                }
            });
            ardoise.save().then(function(){
                showMsg(0,msgToShow);
            });
        })
    },
    updateFormulePriceList:function(modify, callback){
        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        if(modify && app.resto.ardoiseOfDate.id){
            relationFPL.query().find().then(function(results){
                relationFPL.remove(results);
                callback(relationFPL);
            });
        }else{
            callback(relationFPL);
        }
    }

});
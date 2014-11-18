Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoiseView = Parse.View.extend({

    template: _.template($('#ardoise-template').html()),

    importVisuTempl: doT.template($('#ardoise-import-visu-template').html()),

    tempArdoises:null,

    events: {
        //ardoise
        "click #saveArdoiseBtn":'saveArdoise',
        "click .btnCreateArdoise":'createNewArdoise',

        //import ardoise
        "click #btnImportArdoise":'showImportArdoiseModal',
        "click #btnPreviousArdoise":'previousArdoise',
        "click #btnNextArdoise":'nextArdoise',
        "click #importArdoiseConfirm":'importArdoise',

        //formule price
        "click .showAddFormulePriceBtn":"showAddNewFormulePrice",
        "click .hideAddFormulePriceBtn":"hideAddNewFormulePrice",
        "click .addFormulePriceBtn":"addNewFormulePrice",

        //dishes bloc
        "click .showAddDishesBlocBtn":"showAddNewDishesBloc",
        "click .hideAddDishesBlocBtn":"hideAddNewDishesBloc",
        "click .addDishesBlocBtn":"addNewDishesBloc",

        //text
        "click .addTextBtn":"addNewText"
    },

    initialize: function() {
        _.bindAll(this,"saveArdoise","createNewArdoise","searchArdoise","updateLists","saveArdoiseToBase","saveArdoiseWithLists",
            "addNewFormulePrice","showAddNewFormulePrice","hideAddNewFormulePrice","addFormulePrice",
            "addNewDishesBloc","showAddNewDishesBloc","hideAddNewDishesBloc","addDishesBloc",
            "addDish",
            "addText",
        "showImportArdoiseModal","renderImportArodoise","previousArdoise","nextArdoise","importArdoise");

        this.render();

        this.formulePricehelper = new ArdoiseFormulePriceHelper(this);
        this.dishesBlochelper = new ArdoiseDishesBlocHelper(this);
        this.texthelper = new ArdoiseTextHelper(this);

        app.resto.ardoiseOfDate.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoiseOfDate.dishesBlocList = new app.ArdoiseDishesBlocList();
        app.resto.ardoiseOfDate.dishList = new app.ArdoiseDishList();
        app.resto.ardoiseOfDate.textList = new app.ArdoiseTextList();
        app.resto.ardoiseOfDate.formulePriceList.on('add', this.addFormulePrice);
        app.resto.ardoiseOfDate.dishesBlocList.on('add',this.addDishesBloc);
        app.resto.ardoiseOfDate.dishList.on('add',this.addDish);
        app.resto.ardoiseOfDate.textList.on('add',this.addText);
        this.initLists();
    },

    initLists:function(){
        if(this.options.modify){
            this.initFormulePriceListFromRelation();
            this.initDishListFromRelation();//y compris dishesBloc
            this.initTextListFromRelation();
        }
    },

    render: function() {
        this.$el.html( this.template(this.options));

        //petit controle sur un element parent:
        if(this.options.modify){
            $("#visuArdoiseBtn").show();
        }else{
            $("#visuArdoiseBtn").hide();
        }
        //et pour tooltip
        $('[data-toggle="tooltip"]').tooltip();
        return this;
    },

    /* Zone Formule Price */
    initFormulePriceListFromZero:function(callback){
        this.formulePricehelper.initFormulePriceListFromZero(callback);
    },
    initFormulePriceListFromRelation:function(){
        this.formulePricehelper.initFormulePriceListFromRelation();
    },
    addNewFormulePrice:function(e){
        this.formulePricehelper.addNewFormulePrice(e);
    },
    showAddNewFormulePrice:function(e){
        this.formulePricehelper.showAddNewFormulePrice(e);
    },
    hideAddNewFormulePrice:function(e){
        this.formulePricehelper.hideAddNewFormulePrice(e);
    },
    addFormulePrice:function(ardoiseFormulePrice){
        this.formulePricehelper.addFormulePrice(ardoiseFormulePrice);

    },

    /* Zone Dishes Bloc */
    initDishesBlocListFromZero:function(callback){
        this.dishesBlochelper.initDishesBlocListFromZero(callback);
    },
    addNewDishesBloc:function(e){
        this.dishesBlochelper.addNewDishesBloc(e);
    },
    showAddNewDishesBloc:function(e){
        this.dishesBlochelper.showAddNewDishesBloc(e);
    },
    hideAddNewDishesBloc:function(e){
        this.dishesBlochelper.hideAddNewDishesBloc(e);
    },
    addDishesBloc:function(ardoiseDishesBloc){
        this.dishesBlochelper.addDishesBloc(ardoiseDishesBloc);

    },

    /* Zone dish */
    initDishListFromRelation:function(){
        var relationDBL = app.resto.ardoiseOfDate.relation("dishesBlocList");
        relationDBL.query().ascending("order").find().then(function(results){
            app.resto.ardoiseOfDate.dishesBlocList.add(results);
            return Parse.Promise.as();
        }).then(function(){
            var relationDL = app.resto.ardoiseOfDate.relation("dishList");

            relationDL.query().ascending("order").find({
                success:function(dishList){
                    app.resto.ardoiseOfDate.dishList.add(dishList);
                }
            })
        })
    },
    addDish:function(dish){
        var ardoiseDishView = new app.ArdoiseDishView({model:dish});
        $("#zoneDishesBlocs ."+dish.get("idDishesBloc")+" .showAddDishBtn").before(ardoiseDishView.render().el);
    },
    /* zone text */
    initTextListFromRelation:function(){
        this.texthelper.initTextListFromRelation();
    },
    addText:function(text){
        this.texthelper.addText(text);

    },
    addNewText:function(e){
        this.texthelper.addNewText(e);
    },

    /* zone ardoise */
    createNewArdoise: function(e){

        e.preventDefault();
        var datejsForArdoise = this.getActuelDate();
        var that = this;
        this.searchArdoise(datejsForArdoise, function(hasAlreadyArdoise){
            if(hasAlreadyArdoise){
                showMsg(3,"l'ardoise de cette date existe déjà");
            }else{
                that.options.modify=true;
                that.render();
                that.initFormulePriceListFromZero(
                    function(){
                        that.initDishesBlocListFromZero(
                            function(){
                                that.saveArdoiseToBase("Vous venez de créer votre ardoise, modifiez la dés maintenant pour adapter la réalité de votre restaurant!");
                            }
                        );

                    }
                );
            }
        });

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

    getActuelDate:function(){
        return moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
    },

    saveArdoiseToBase:function(msgToShow){

        var datejsForArdoise = this.getActuelDate();
        var ardoiseTitle = $("#ardoiseTitle").val();

        var ardoise = app.resto.ardoiseOfDate;

        ardoise.set("resto",app.resto);
        ardoise.set("date",datejsForArdoise);
        ardoise.set("title",ardoiseTitle);

        this.updateLists(this.options.modify,msgToShow);
    },
    updateLists:function(modify, msgToShow)
    {

        var self=this;
        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        var relationDBL = app.resto.ardoiseOfDate.relation("dishesBlocList");
        var relationDL = app.resto.ardoiseOfDate.relation("dishList");
        var relationTL = app.resto.ardoiseOfDate.relation("textList");

        if(modify && app.resto.ardoiseOfDate.id){//on commence par netroyer
            relationFPL.query().find().
            then(function(results){
                if(results!=null && results.length>0)
                relationFPL.remove(results);
                return Parse.Promise.as();
            }).then(function(){
                return relationDBL.query().find();
             }).then(function(results){
                    if(results!=null && results.length>0)
                        relationDBL.remove(results);
                    return Parse.Promise.as();
            }).then(function(){
                    return relationDL.query().find();
                }).then(function(results){
                    if(results!=null && results.length>0)
                        relationDL.remove(results);
                    return Parse.Promise.as();
            }).then(function(){
                return relationTL.query().find();
            }).then(function(results){
                    if(results!=null && results.length>0)
                        relationTL.remove(results);
                return Parse.Promise.as();
            }).then(function(){
                self.saveArdoiseWithLists(relationFPL, relationDBL, relationDL, relationTL, msgToShow);
            });
        }else{
            self.saveArdoiseWithLists(relationFPL, relationDBL, relationDL, relationTL, msgToShow);
        }
    },
    saveArdoiseWithLists:function(relationFPL,relationDBL,relationDL,relationTL, msgToShow){

        app.resto.ardoiseOfDate.formulePriceList.forEach (function (model) {
            if(!model.toBeRemoved){relationFPL.add(model);}
        });

        app.resto.ardoiseOfDate.dishesBlocList.forEach (function (model) {
            if(!model.toBeRemoved){relationDBL.add(model);}
        });

        app.resto.ardoiseOfDate.dishList.forEach (function (model) {
            if(!model.toBeRemoved){relationDL.add(model);}
        });

        app.resto.ardoiseOfDate.textList.forEach (function (model) {
            if(!model.toBeRemoved){relationTL.add(model);}
        });

        app.resto.ardoiseOfDate.save().then(function(){
            showMsg(0,msgToShow);
        })
    },

    showImportArdoiseModal:function(e){
        e.preventDefault();
        var self=this;
        $("#importArdoiseModal").modal("show");

        var queryArdoise = new Parse.Query(app.Ardoise);
        queryArdoise.descending("date");
        queryArdoise.equalTo("resto",app.resto);
        queryArdoise.limit(20);
        queryArdoise.find().then(function(ardoises){
            if(ardoises.length>0){
                self.tempArdoises=ardoises;
                self.renderImportArodoise(ardoises);


            }else{
                $("#showArdoiseWaiting").html("No ardoise trouvé!");
            }
        })
    },
    renderImportArodoise:function(ardoises){
        var self = this;
        if(!app.resto.importVisuArdoiseIndex){
            app.resto.importVisuArdoiseIndex=0;
        }
        var ardoise = ardoises[app.resto.importVisuArdoiseIndex];
        var datejs = ardoise.get("date");
        var dateToShow = moment(datejs).format("DD/MM/YYYY");
        $("#tobeImportedArdoiseDate").val(dateToShow);
        self.tempFormulePriceList = new app.ArdoiseFormulePriceList();
        self.tempDishesBlocList = new app.ArdoiseDishesBlocList();
        self.tempDishList = new app.ArdoiseDishList();
        self.tempTextList = new app.ArdoiseTextList();
        ardoise.relation("formulePriceList").query().find().then(
            function(results){
                self.tempFormulePriceList.add(results);
                return ardoise.relation("dishesBlocList").query().find();
        }).then(function(results){
                self.tempDishesBlocList.add(results);
                return ardoise.relation("textList").query().find();
        }).then(function(results){
                self.tempTextList.add(results);
                return ardoise.relation("dishList").query().find();
        }).then(function(results){
                self.tempDishList.add(results);
                return Parse.Promise.as();
         }).then(function(){
                $("#showImportArdoise").html(
                    self.importVisuTempl(
                        {titleArdoise:ardoise.get("title"),
                            formulePriceList:self.tempFormulePriceList.withPriceList(),
                            dishesBlocList: self.tempDishesBlocList.hasDishesList(self.tempDishList),
                            textList:self.tempTextList.notToBeRemovedList()})
                );

                for(var i=0; i<self.tempDishList.toArray().length; i++){
                    var dish = self.tempDishList.toArray()[i];
                    var priceToShow="";
                    if(dish.get("priceEuro")!=""){
                        priceToShow = "  " + dish.get('priceEuro')+" €";
                    }
                    $(".ardoiseVisu ."+dish.get("idDishesBloc")).append("<p>"+dish.get("label")+priceToShow+"</p>");
                }
         })
        //les deux buttons < >
        $("#btnNextArdoise").show();
        $("#btnPreviousArdoise").show();
        if(app.resto.importVisuArdoiseIndex === 0){
            $("#btnNextArdoise").hide();
        }
        if(app.resto.importVisuArdoiseIndex == ardoises.length -1){
            $("#btnPreviousArdoise").hide();
        }
    },
    previousArdoise: function (e) {
        e.preventDefault();
        if(app.resto.importVisuArdoiseIndex<this.tempArdoises.length-1){
            app.resto.importVisuArdoiseIndex++;
            this.renderImportArodoise(this.tempArdoises);
        }
    },
    nextArdoise:function(e){
        e.preventDefault();
        if(app.resto.importVisuArdoiseIndex>0){
            app.resto.importVisuArdoiseIndex--;
            this.renderImportArodoise(this.tempArdoises);
        }
    },

    importArdoise:function(e){
        e.preventDefault();
        var self= this;
        if(self.tempArdoises!=null && self.tempArdoises.length>0){
            var ardoiseAImporter = self.tempArdoises[app.resto.importVisuArdoiseIndex];
            var newArdoise = ardoiseAImporter.clone();
            newArdoise.set("date", this.getActuelDate());
            newArdoise.save().then(function(ardoise){
                app.resto.ardoiseOfDate = ardoise;
                $("#importArdoiseModal").modal("hide");
                self.options.modify=true;
                app.resto.ardoiseOfDate.formulePriceList = self.tempFormulePriceList;
                app.resto.ardoiseOfDate.dishesBlocList = self.tempDishesBlocList;
                app.resto.ardoiseOfDate.dishList = self.tempDishList;
                app.resto.ardoiseOfDate.textList = self.tempTextList;

                var refresh="<button onclick='location.reload()'>Rafraichir</button>"
                self.saveArdoiseToBase("L'ardoise a été créé avec l'import de l'arodoise "+refresh);


            })



        }
    }
});
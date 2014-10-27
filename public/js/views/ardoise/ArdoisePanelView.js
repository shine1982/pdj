Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoisePanelView = Parse.View.extend({

    el:'#restoManagement',

    template: _.template($('#ardoise-panel-template').html()),


    events: {

    },

    initialize: function(id) {

        this.render();
        this.init3rdBootstrapComponent();
        this.on("dateArdoiseChange", this.ardoiseDateChange);
        this.trigger("dateArdoiseChange");
    },
    ardoiseDateChange:function(){

        var dateForArdoise = $('#ardoiseDatepicker').val();
        var datejsForArdoise = moment(dateForArdoise, "DD/MM/YYYY").toDate();
        var that = this;
        this.searchArdoiseOfDate(datejsForArdoise,app.resto, function(modify){

            if(!modify){//s'il s'agit de la création. Si oui, alors vérifié si une ardoise a déjà été créer pour ce resto
                var queryArdoise = new Parse.Query(app.Ardoise);
                queryArdoise.equalTo("resto", app.resto);
                queryArdoise.limit(1);
                queryArdoise.find().then(function(results){
                    var alreadyCreatedArdoise = false;
                    if(results.length>0){
                        alreadyCreatedArdoise = true;
                    }
                    if(that.ardoiseView){
                        that.ardoiseView.undelegateEvents();
                    }
                    that.ardoiseView = new app.ArdoiseView({el:"#ardoise", ardoise: app.resto.ardoiseOfDate,modify: modify,alreadyCreatedArdoise: alreadyCreatedArdoise});
                });
            }else{
                if(that.ardoiseView){
                    that.ardoiseView.undelegateEvents();
                }
                that.ardoiseView = new app.ArdoiseView({el:"#ardoise", ardoise: app.resto.ardoiseOfDate,modify: modify,alreadyCreatedArdoise: true});
            }
        });
    },

    searchArdoiseOfDate:function(jsDateSelected, resto, callback){

        if(app.resto.ardoiseOfDate && app.resto.ardoiseOfDate.get("date") === jsDateSelected){
            callback(true);
        }else{

            var queryArdoise = new Parse.Query(app.Ardoise);
            queryArdoise.equalTo("resto", app.resto);
            queryArdoise.equalTo("date",jsDateSelected);
            queryArdoise.find().then(
                function(ardoises){
                    if(ardoises.length>0){
                        app.resto.ardoiseOfDate =ardoises[0];//donc ardoise existe déjà, c'est une mise à jour
                        callback(true);
                    }else{
                        app.resto.ardoiseOfDate = new app.Ardoise();
                        callback(false);
                    }
                },
                function(error){
                    showMsg(3,error.message);
                });

        }

    },

    init3rdBootstrapComponent:function(){
        var that = this;
        $('#ardoiseDatepicker').datepicker('setValue', new Date()).on('changeDate',
            function(ev){
                $('#ardoiseDatepicker').datepicker('hide');
                that.trigger("dateArdoiseChange");
            });
     },


    render: function() {
        this.$el.html( this.template());
        return this;
    }
});
var ContactView = Parse.View.extend({

    //... is a list tag.
    el:'#restoManagement',

    // Cache the template function for a single item.
    template: _.template($('#contact-template').html()),

    events: {
       'submit form': 'saveContact'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(id) {

        // this.listenTo(this.model, 'change', this.render);
        this.idResto = id;

    },
    searchContactAndShow:function(){
        var that = this;
        var queryContact = new Parse.Query(app.Contact);
        queryContact.equalTo("resto", app.resto);
        queryContact.first({
            success: function(result){
                if(result){
                    app.resto.contact = result;
                    that.$el.html( that.template({contact: result}) );
                }else{
                    app.resto.contact = new app.Contact();
                }
            },
            error:function(error){
                app.resto.contact = new app.Contact();
                that.$el.html( that.template({contact: app.resto.contact}) );
            }
        });
    },
    render: function() {
        var that = this;
        if(this.idResto){
            if(app.resto && app.resto.id === this.idResto){
                this.searchContactAndShow();
            }else{
                var queryResto = new Parse.Query(app.Restaurant);
                queryResto.get(this.idResto, {
                    success: function(resto) {
                        app.resto = resto;
                        that.searchContactAndShow();
                    },
                    error: function(object, error) {
                        showMsg(3,"Error pour récuperer le resto avec id "+this.id +" ("+error+")");
                    }
                });
            }
        }

        this.$el.html( this.template({contact: false}) );
        return this;
    },

    saveContact: function(e) {
        e.preventDefault();

        var data = Backbone.Syphon.serialize(this);

        app.resto.contact.set(data);
        app.resto.contact.set("resto",app.resto);
        app.resto.contact.save(null, {
            success: function(contact) {
                app.resto.contact = contact;
                var msgToShow = "Le contact '"+ contact.get("firstname") + "' a été mis à jour";
                showMsg(0,msgToShow);
            },
            error: function(contact, error) {
                showMsg(3,error.message);
            }
        });

    }



});
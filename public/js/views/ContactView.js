var app = app || {};
app.ContactView = Parse.View.extend({


    el:'#restoManagement',

    // Cache the template function for a single item.
    template: _.template($('#contact-template').html()),

    events: {
       'submit form': 'saveContact'
    },

    initialize: function() {
        _.bindAll(this,"render","renderContact")
        this.render();
    },

    render: function() {
        var that=this;
        if(!app.resto.contact){
            var queryContact = new Parse.Query(app.Contact);
            queryContact.equalTo("resto", app.resto);
            queryContact.first({
                success: function(result){
                    if(result){
                        app.resto.contact = result;
                    }else{
                        app.resto.contact = new app.Contact();
                    }
                    that.renderContact();
                },
                error:function(error){
                    showMsg(3,error.message);
                }
            });
        }
        this.renderContact();
        return this;
    },

    renderContact:function(){
        this.$el.html( this.template({contact: app.resto.contact}) );
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
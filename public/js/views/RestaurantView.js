var app = app || {};
app.RestaurantView = Parse.View.extend({

    el:'#restoManagement',

    template: _.template($('#addresto-template').html()),

    events: {
        'submit form': 'saveResto'
    },

    initialize: function() {

        this.render();
    },

    render: function() {
        if(app.resto){
            this.$el.html( this.template({resto: app.resto}) );
        }else{
            this.$el.html( this.template({resto: false}) );
        }
        return this;
    },

    saveResto: function(e) {
        e.preventDefault();

        var data = Backbone.Syphon.serialize(this);
        var resto = app.resto;
        var isModeModify=true;
        if(!resto){
            resto = new app.Restaurant();
            isModeModify=false;
        }
        resto.set(data);
        // Set up the ACL so everyone can read the image
        // but only the owner can have write access
       /*
        if(!isModeModify){//creation
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            if (Parse.User.current()) {

                acl.setWriteAccess(Parse.User.current(), true);
            }
            resto.setACL(acl);
        }*/

        if(Parse.User.current()){
            resto.set("user", Parse.User.current());
        }

        resto.save(null, {
            success: function(resto) {
               var msgToShow = "Le restaurant '"+ resto.get("name") + (isModeModify?"' a été mis à jour":"' a été ajouté");
               showMsg(0,msgToShow);
               if(!isModeModify){
                   app.router.navigate('edit/'+resto.id, {trigger: true});
               }

            },
            error: function(resto, error) {
                showMsg(3,error.message);
            }
        });
    }
});
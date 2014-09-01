var RestaurantView = Parse.View.extend({

    //... is a list tag.
    el:'#restoManagement',

    // Cache the template function for a single item.
    template: _.template($('#addresto-template').html()),

    // The DOM events specific to an item.
    events: {
        'submit form': 'saveResto'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(id) {
        this.idResto = id;

       // this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
        var that = this;
        if(this.idResto){
            if(app.resto && app.resto.id===this.idResto){
                that.$el.html( that.template({resto: app.resto}));
                that.resto=app.resto;
            }else{
                var query = new Parse.Query(app.Restaurant);
                query.get(this.idResto, {
                    success: function(resto) {
                        that.$el.html( that.template({resto: resto}) );
                        app.resto = resto;
                        that.resto=resto;
                    },
                    error: function(object, error) {
                        showMsg(3,"Error pour récuperer le resto avec id "+this.idResto +" ("+error+")");
                    }
                });
            }

        }else{
            this.$el.html( this.template({resto:false}) );
        }

        return this;
    },

    saveResto: function(e) {
        e.preventDefault();

        var data = Backbone.Syphon.serialize(this);
        var resto;
        var isModeModify=false;
        if(this.resto){
            resto = this.resto;
            isModeModify=true;
        }else{
            resto = new app.Restaurant();
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
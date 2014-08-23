var RestaurantView = Parse.View.extend({

    //... is a list tag.
    el:'.page',

    // Cache the template function for a single item.
    template: _.template($('#addresto-template').html()),

    // The DOM events specific to an item.
    events: {
        'submit form': 'saveResto'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
       // this.listenTo(this.model, 'change', this.render);
    },

    render: function(id) {
        var that = this;
        if(id){
            var query = new Parse.Query(app.Restaurant);
            query.get(id, {
                success: function(resto) {
                    that.$el.html( that.template({resto: resto}) );
                    that.resto=resto;
                },
                error: function(object, error) {
                   showMsg(3,"Error pour récuperer le resto avec id "+id +" ("+error+")");
                }
            });
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
        resto.setACL(new Parse.ACL(Parse.User.current()));
        resto.save(null, {
            success: function(resto) {
               var msgToShow = "Le restaurant '"+ resto.get("name") + (isModeModify?"' a été mis à jour":"' a été ajouté");
               showMsg(0,msgToShow);

            },
            error: function(resto, error) {
                showMsg(3,error.message);
            }
        });

    }



});
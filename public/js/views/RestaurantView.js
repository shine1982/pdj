var RestaurantView = Parse.View.extend({

    //... is a list tag.
    el:'.page',

    // Cache the template function for a single item.
    template: _.template( $('#addresto-template').html() ),

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

    render: function() {
        this.$el.html( this.template( {} ) );
        return this;
    },

    saveResto: function(e) {
        e.preventDefault();

        var data = Backbone.Syphon.serialize(this);

        var resto = new app.Restaurant();

        resto.set(data);
/*
        resto.set("address",data.address);
        resto.set("postalCode",data.postalcode);
        resto.set("city",data.city);*/

        resto.save(null, {
            success: function(resto) {
                // Execute any logic that should take place after the object is saved.
             //   alert('New object created with objectId: ' + resto.id);
            },
            error: function(resto, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and description.
               // alert('Failed to create new object, with error code: ' + error.message);
            }
        });

/*
        this.model.save().then(
            function(resto){
                alert(resto.id + "resto saved!");
            }
        );*/

    }



});
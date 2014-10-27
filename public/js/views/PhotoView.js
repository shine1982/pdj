var PhotoView = Parse.View.extend({


    tagName:'div',
    className:'col-xs-6 col-md-2 photoTbn',

    template: _.template($('#photo-template').html()),

    events: {
        'click .destroy': 'clear',
        'click .thumbnail': 'showNormalPhoto'
    },

    initialize: function() {
        this.model.bind('change', this.render);
    },

    render: function() {
        this.$el.html( this.template( this.model.attributes ));
        return this;
    },

    clear: function(){
        this.model.destroy();
        this.remove();
    },

    showNormalPhoto:function(e){
        e.preventDefault();
        $("#showNormalImageModal").modal('show');
        $("#showNormalImageModal img").first().attr("src",this.model.get("normalPhoto").url());
    }
});
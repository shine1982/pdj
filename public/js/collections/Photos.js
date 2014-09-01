var app = app || {};

app.Photos = Parse.Collection.extend({

    model: app.Photo,

    nextOrder:function(photoCategory){
        var photos = this.filter(function(photo){
            return photo.get("category") == photoCategory;
        });
        if (!photos.length) return 1;
        return photos[photos.length-1].get('order') + 1;
    },
    comparator:function(photo){
        return photo.get("order");
    }
});
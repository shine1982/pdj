require('cloud/app.js');

Parse.Cloud.job("updatePlatdujourForAllRestaurants", function(req,status) {
    var Restaurant = Parse.Object.extend("Restaurant");
    var query = new Parse.Query(Restaurant);
    query.find({
        success: function(results) {
            for(var i=0; i< results.length; i++){
                setPlatdujour(results[i]);
            }
            status.success("ok");
        },
        error:function(restaurants,error){
            status.error(error);
    }
    });
});

var saveImage = require("cloud/lib/image/save-image")
var setPlatdujour = require('cloud/lib/setPlatdujour');

Parse.Cloud.beforeSave("Photo", function(req, res) {
    return saveImage(req,res);
});

Parse.Cloud.beforeSave("TodayDish", function(req, res) {
    return saveImage(req,res);
});

Parse.Cloud.afterSave("TodayDish", function(req){
        setPlatdujour(req.object.get("resto"));
    }
)

Parse.Cloud.beforeDelete("TodayDish", function(req,res){
        var query = new Parse.Query("Restaurant");
        query.get(req.object.get("resto").id).then(
            function(resto){
                resto.set("platdujour", null);
                resto.set("platdujourUrl",'');
                resto.save().then(function(resto){
                    res.success("ref plat du jour deleted from restaurant :"+resto.id);
                },function(resto,error){
                    res.error(error);
                })

            }
        )

    }
)
Parse.Cloud.afterDelete("TodayDish", function(req){
        setPlatdujour(req.object.get("resto"));
    }
)






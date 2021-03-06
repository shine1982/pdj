var moment = require("moment");
var _ = require('underscore');

module.exports = function (resto){

    var restoToBeModified = resto;
    var TodayDish= Parse.Object.extend("TodayDish");
    var queryTodayDish = new Parse.Query(TodayDish);
    queryTodayDish.equalTo("resto",resto);
    queryTodayDish.descending("updatedAt");
    var now = moment().add("hours",2);
    queryTodayDish.find({success: function (todayDishesOfResto) {

            console.log("todayDishesOfResto.length-"+todayDishesOfResto.length);

            var todayDishesNonRec = _.filter(todayDishesOfResto, function (todayDish) {

                    var onlyDate= moment(todayDish.get("onlydate"));
                    onlyDate = onlyDate.add("hours",2);
                    var onlyDateFormatted = onlyDate.format("DD/MM/YYYY");
                    return (todayDish.get("recurrence") === 'jamais')
                        && (onlyDateFormatted === now.format("DD/MM/YYYY"));
                }
            )
            if (todayDishesNonRec && todayDishesNonRec.length > 0) {
                restoToBeModified.set("platdujour", todayDishesNonRec[0]);
                restoToBeModified.set("platdujourUrl",todayDishesNonRec[0].get("miniThumbnailPhoto").url());
                restoToBeModified.save();
            } else {
                var dayStrings = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
                var todayDishesRec = _.filter(todayDishesOfResto, function (todayDish) {
                        return todayDish.get("recurrence") !== 'jamais';
                    }
                );
                var dayNb = now.day();
                for (var i=0; i<todayDishesRec.length; i++ ) {
                    if (dayStrings[dayNb] === todayDishesRec[i].get("recurrence")) {
                        restoToBeModified.set("platdujour", todayDishesRec[i]);
                        restoToBeModified.set("platdujourUrl",todayDishesRec[i].get("miniThumbnailPhoto").url());
                        restoToBeModified.save();
                        break;
                    }
                }
            }
        }
        }
    )
}

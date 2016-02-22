module.exports = function($) {
    $.prototype.parseul = function() {
        var data = [];

        $("ul.NewForecast.investMaster").each(function(row_idx, row) {
            $("li", row).each(function(list_idx, item) {
                var content = $(".personSmallRight a", item).attr().href;
                data.push(content.replace(/.+yoso\/([0-9]{4})/g,'$1'));
            });
        });

        return data;
    };
}

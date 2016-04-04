module.exports = function($) {
    $.prototype.parsetable = function(dupCols, dupRows, textMode) {
        if (dupCols === undefined) dupCols = false;
        if (dupRows === undefined) dupRows = false;
        if (textMode === undefined) textMode = false;

        var columns = [],
            curr_x = 0,
            curr_y = 0;

        $("tr", this).each(function(row_idx, row) {
            curr_y = 0;
            $("td, th", row).each(function(col_idx, col) {
                var rowspan = $(col).attr('rowspan') || 1;
                var colspan = $(col).attr('colspan') || 1;
                if (textMode === true) {
                    var content = $(col).text().trim() || "";
                    if($(col).html().indexOf("href") > -1 &&
                       $(col).html().indexOf("code") > -1) {
                      content = $(col).html().replace(/.+code=([0-9]{4}).+/g,'$1');
                    }
                } else {
                    var content = $(col).html() || "";
                }

                var x = 0,
                    y = 0;
                for (x = 0; x < rowspan; x++) {
                    for (y = 0; y < colspan; y++) {
                        if (columns[curr_x + x] === undefined) {
                            columns[curr_x + x] = []
                        }

                        while (columns[curr_x + x][curr_y + y] !== undefined) {
                            curr_x += 1
                            if (columns[curr_x + x] === undefined) {
                                columns[curr_x + x] = []
                            }
                        }

                        if ((x === 0 || dupRows) && (y === 0 || dupCols)) {
                            columns[curr_x + x][curr_y + y] = content
                        } else {
                            columns[curr_x + x][curr_y + y] = ""
                        }
                    }
                }
                curr_y += 1;
            });
            curr_x += 1;
        });

        return columns;
    };
}

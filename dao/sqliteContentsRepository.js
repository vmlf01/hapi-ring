/**
 * Created by vmlf on 09-05-2015.
 */
var Hoek = require('hoek');


var internals = {
    defaults: {},
    options: {},
    db: null
};


exports.register = function (server, options, next) {

    internals.options = Hoek.applyToDefaults(internals.defaults, options);
    internals.db = internals.options.db;

    next();
};


exports.register.attributes = {
    name: 'sqlite-contents-repository'
};


exports.getCategories = function getCategories (onlyWithContents, cb) {

    var query = 'SELECT IdCategory, Name FROM Categories';

    if (onlyWithContents) {
        query = query + ' WHERE EXISTS (SELECT 1 FROM Contents WHERE Categories.IdCategory = Contents.IdCategory)';
    }

    query = query + ' ORDER BY Name COLLATE NOCASE ASC;';

    internals.db.executeQuery(query, cb);
};


exports.getPerformers = function getPerformers (onlyWithContents, cb) {

    var query = 'SELECT IdPerformer, Name FROM Performers';

    if (onlyWithContents) {
        query = query + ' WHERE EXISTS (SELECT 1 FROM Contents WHERE Performers.IdPerformer = Contents.IdPerformer)';
    }

    query = query + ' ORDER BY Name COLLATE NOCASE ASC;';

    internals.db.executeQuery(query, cb);
};


exports.getPerformersStartingWith = function getPerformersStartingWith (startLetter, onlyWithContents, cb) {

    var query = 'SELECT IdPerformer, Name FROM Performers WHERE Name LIKE $startLetter';

    if (onlyWithContents) {
        query = query + ' AND EXISTS (SELECT 1 FROM Contents WHERE Performers.IdPerformer = Contents.IdPerformer)';
    }

    query = query + ' ORDER BY Name COLLATE NOCASE ASC;';

    internals.db.executeQueryWithParams(query, {
        $startLetter: startLetter + '%'
    }, cb);
};


exports.getTopContents = function getTopContents (startIndex, numberOfItems, cb)
{
    var contentsQuery = ' SELECT * FROM TOP_CONTENTS t ' +
                        ' INNER JOIN CONTENTS c ON t.IdContent = c.IdContent ' +
                        ' ORDER BY t.SalesOrder DESC ' +
                        ' LIMIT $count OFFSET $start';

    var contentsParams = {
        $start: startIndex,
        $count: numberOfItems < 100 ? numberOfItems : 100 // return a maximum of 100 rows
    };

    internals.db.execute(function (db, done) {

        // get contents page

        return db.all(contentsQuery, contentsParams, function (err, rows) {
            if (err) {
                return done(err, null);
            }
            else {

                // get total contents count

                var countQuery = ' SELECT COUNT(*) as totalRows FROM TOP_CONTENTS t ' +
                                 ' INNER JOIN CONTENTS c ON t.IdContent = c.IdContent';

                return db.get(countQuery, function (err, count) {
                    if (err) {
                        return done(err, null);
                    }
                    else {
                        return done(null, {
                            results: rows,
                            totalRows: count.totalRows
                        });
                    }
                });
            }
        });
    }, cb);
};


exports.getCategoryContents = function getCategoryContents (categoryId, startIndex, numberOfItems, cb)
{
    var contentsQuery = ' SELECT * FROM CONTENTS ' +
        ' WHERE IdCategory = $idCategory ' +
        ' ORDER BY CreationDate DESC ' +
        ' LIMIT $count OFFSET $start';

    var contentsParams = {
        $idCategory: categoryId,
        $start: startIndex,
        $count: numberOfItems < 100 ? numberOfItems : 100 // return a maximum of 100 rows
    };

    internals.db.execute(function (db, done) {

        // get contents page

        return db.all(contentsQuery, contentsParams, function (err, rows) {
            if (err) {
                return done(err, null);
            }
            else {

                // get total contents count

                var countQuery = ' SELECT COUNT(*) as totalRows FROM CONTENTS ' +
                    ' WHERE IdCategory = $idCategory ';

                return db.get(countQuery, { $idCategory: categoryId }, function (err, count) {
                    if (err) {
                        return done(err, null);
                    }
                    else {
                        return done(null, {
                            results: rows,
                            totalRows: count.totalRows
                        });
                    }
                });
            }
        });
    }, cb);
};



/*


public PagedResults<Content> GetContents(string searchString, int startIndex, int numberOfItems)
{
    using (var connection = OpenDbConnection())
    {
        return new PagedResults<Content>(
            connection.Query<Content>(@"SELECT * FROM CONTENTS WHERE Name LIKE @search ORDER BY CreationDate DESC LIMIT @count OFFSET @start", new
    {
        search = string.IsNullOrEmpty(searchString) ? "%" : "%" + searchString + "%",
        count = Math.Min(100, numberOfItems),
        start = startIndex
    }),
    connection.ExecuteScalar<int>(@"SELECT COUNT(*) FROM CONTENTS WHERE Name LIKE @search", new
{
    search = string.IsNullOrEmpty(searchString) ? "%" : "%" + searchString + "%"
})
);
}
}

public PagedResults<Content> GetContentsForCategory(string idCategory, string searchString, int startIndex, int numberOfItems)
{
    using (var connection = OpenDbConnection())
    {
        return new PagedResults<Content>(
            connection.Query<Content>(@"SELECT * FROM CONTENTS WHERE Name LIKE @search AND IdCategory = @id ORDER BY CreationDate DESC LIMIT @count OFFSET @start", new
    {
        search = string.IsNullOrEmpty(searchString) ? "%" : "%" + searchString + "%",
        id = idCategory,
        count = Math.Min(100, numberOfItems),
        start = startIndex
    }),
    connection.ExecuteScalar<int>(@"SELECT COUNT(*) FROM CONTENTS WHERE Name LIKE @search AND IdCategory = @id", new
{
    search = string.IsNullOrEmpty(searchString) ? "%" : "%" + searchString + "%",
    id = idCategory
})
);
}
}

public PagedResults<Content> GetContentsForPerformer(string idPerformer, int startIndex, int numberOfItems)
{
    using (var connection = OpenDbConnection())
    {
        return new PagedResults<Content>(
            connection.Query<Content>(@"SELECT * FROM CONTENTS WHERE IdPerformer = @id ORDER BY CreationDate DESC LIMIT @count OFFSET @start", new
    {
        id = idPerformer,
        count = Math.Min(100, numberOfItems),
        start = startIndex
    }),
    connection.ExecuteScalar<int>(@"SELECT COUNT(*) FROM CONTENTS WHERE IdPerformer = @id", new
{
    id = idPerformer
})
);
}
}

public Content GetContent(string idContent)
{
    using (var connection = OpenDbConnection())
    {
        return connection.Query<Content>(@"SELECT * FROM CONTENTS WHERE IdContent = @id", new
    {
        id = idContent
    }).FirstOrDefault();
}
}

private long UnixTimestampFromDateTime(DateTime date)
{
    long unixTimestamp = date.Ticks - new DateTime(1970, 1, 1).Ticks;
    unixTimestamp /= TimeSpan.TicksPerSecond;
    return unixTimestamp;
}
}
}
    */

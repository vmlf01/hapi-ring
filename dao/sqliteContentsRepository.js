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
    var pagedQuery = {
        columns: '*',
        from: 'TOP_CONTENTS t INNER JOIN CONTENTS c ON t.IdContent = c.IdContent',
        orderBy: 't.SalesOrder DESC',
        startIndex: startIndex,
        numberOfItems: numberOfItems,
    };

    return internals.db.executePagedQuery(pagedQuery, cb);
};


exports.getCategoryContents = function getCategoryContents (categoryId, startIndex, numberOfItems, cb)
{
    var pagedQuery = {
        columns: '*',
        from: 'CONTENTS',
        where: 'IdCategory = $idCategory',
        orderBy: 'CreationDate DESC',
        startIndex: startIndex,
        numberOfItems: numberOfItems,
        params: {
            $idCategory: categoryId,
        }
    };

    return internals.db.executePagedQuery(pagedQuery, cb);
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

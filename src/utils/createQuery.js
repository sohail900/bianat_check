import esb from "elastic-builder";

export function createQuery(obj, action) {
  delete obj.title;
  delete obj.isPublic;
  delete obj.username;
  delete obj._kuzzle_info;

  if (obj._kuzzle_info) delete obj._kuzzle_info;
  if (obj._id) delete obj._id;

  const mustQuery = [];

  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        if (typeof obj[key] === "boolean") {
          mustQuery.push(esb.matchQuery(key, obj[key]));
        } else if (
          typeof obj[key] !== "object" &&
          obj[key].match(/(>|<|<=|>=|=)/)
        ) {
          const filters = obj[key].split("&");
          let subQuery = esb.rangeQuery(key);

          filters.forEach((filter) => {
            const [filterKey, filterValue] = filter.trim().split(" ");


            switch (filterKey) {
              case ">":
                subQuery = subQuery.gt(parseFloat(filterValue));
                break;
              case "<":
                subQuery = subQuery.lt(parseFloat(filterValue));
                break;
              case ">=":
                subQuery = subQuery.gte(parseFloat(filterValue));
                break;
              case "<=":
                subQuery = subQuery.lte(parseFloat(filterValue));
                break;
              case "=":
                subQuery = subQuery
                  .lt(parseFloat(filterValue))
                  .gte(parseFloat(filterValue));
                break;
              default:
                break;
            }
          });

          mustQuery.push(subQuery);
        } else if (key.includes("custom")) {
          const newKey = obj[key];
          mustQuery.push(esb.matchQuery(newKey, true));
        } else if (typeof obj[key] === "object") {
          const newQuery = esb.rangeQuery(key);

          if (obj[key]?.min) {
            newQuery.gte(obj[key].min);
          }

          if (obj[key]?.max) {
            newQuery.lte(obj[key].max);
          }

          mustQuery.push(newQuery);
        } else {
          mustQuery.push(esb.matchQuery(key, obj[key]));
        }
      }
    });
  }

  if (action) {
    mustQuery.push(esb.matchQuery(action, 1));
  }

  const query = esb
    .requestBodySearch()
.query(esb.boolQuery().must(mustQuery).mustNot(esb.termQuery('indx', 'Mutual Fund'))).toJSON();

  return query;
}

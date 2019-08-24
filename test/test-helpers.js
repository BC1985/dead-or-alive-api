const { TEST_DB_URL } = require("../src/config");
const knex = require("knex")({
  client: "pg",
  connection: TEST_DB_URL
});
function makePeopleArray() {
  return [
    {
      id: 1,
      person_name: "Mozart",
      status: "dead",
      description: "pushing up daisies",
      dates: "1756-1791",
      image: "image.jpg"
    },
    {
      id: 2,
      person_name: "Beethoven",
      status: "dead",
      dates: "1770-1827",
      description: "not alive",
      image: "image.jpg"
    },
    {
      id: 3,
      person_name: "Tom Waits",
      status: "alive",
      dates: "born 1949",
      description: "may he live long and prosper",
      image: "image.jpg"
    }
  ];
}
function cleanTables() {
  knex.schema.raw("SET sql_mode='TRADITIONAL'").table("people", table => {
    table.dropTable("people");
    table.createTable("people", table => {
      table
        .increments("id")
        .table.string("person_name")
        .table.string("status")
        .table.string("dates")
        .table.string("description")
        .table.string("image");
    });
  });
}
function userNotInDB() {
  return [
    { id: 1, person_name: "Namey McName1" },
    { id: 2, person_name: "Namey McName2" },
    { id: 3, person_name: "Namey McName3" }
  ];
}

module.exports = { makePeopleArray, cleanTables, userNotInDB };

const peopleServices = {
  getPeople(knex) {
    return knex.select("*").from("people");
  }
};

module.exports = { peopleServices };

const peopleServices = {
  getPeople(knex) {
    return knex.select("*").from("people");
  },
  postPerson(knex, person) {
    return knex
      .returning(["id", "person_name", "dates", "status", "description"])
      .from("people")
      .insert(person);
  },
  getPersonById(knex, id) {
    return knex("people")
      .from("people")
      .select("*")
      .where({ id });
  }
};

module.exports = { peopleServices };

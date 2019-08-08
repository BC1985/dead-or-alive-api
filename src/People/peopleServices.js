const peopleServices = {
  getPeople(knex) {
    return knex.select("*").from("people");
  },
  postPerson(knex, person) {
    return knex
      .returning(["id", "person_name", "dates", "status", "description"])
      .from("people")
      .insert(person);
  }
};

module.exports = { peopleServices };

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
  },
  deletePerson(knex, id) {
    return knex("people")
      .from("people")
      .where({ id })
      .del();
  },
  updatePerson(knex, id, updatedFields) {
    return knex("people")
      .from("people")
      .where({ id })
      .update(updatedFields);
  }
};

module.exports = { peopleServices };

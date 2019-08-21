const peopleServices = {
  getPeople(knex) {
    return knex.select("*").from("people");
  },
  postPerson(knex, person) {
    return knex
      .returning([
        "id",
        "person_name",
        "dates",
        "status",
        "description",
        "image"
      ])
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
  },
  personNotInDB(knex, name) {
    return knex
      .returning(["person_name"])
      .from("not_in_db")
      .insert(name);
  },
  getUnknownPerson(knex) {
    return knex.select("*").from("not_in_db");
  },
  //For deleting people from "not_in_db" table after they have been added to main "people" db
  deleteUnknownPerson(knex, id) {
    return knex("not_in_db")
      .from("not_in_db")
      .where({ id })
      .del();
  }
};

module.exports = { peopleServices };

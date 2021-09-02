import knex from "knex";
import dbConfig from "../../knexfile";

class DB {
  constructor() {
    const environment = "development_sqlite3";
    console.log(`SETTING ${environment} DB`);
    const options = dbConfig[environment];
    this.connection = knex(options);
    console.log(options);
  }

  init() {
    console.log("cargando base");
    this.connection.schema.hasTable("productos").then((exists) => {
      if (!exists) {
        console.log("Creamos la tabla productos!");

        this.connection.schema
          .createTable("productos", (productosTable) => {
            productosTable.increments("id");
            productosTable.string("title").notNullable();
            productosTable.integer("price").notNullable();
            productosTable.string("thumbnail").notNullable();
          })
          .then(() => {
            console.log("Done");
          });
      }
    });
  }

  get(tableName, id) {
    if (id) return this.connection(tableName).where("id", id);

    return this.connection(tableName);
  }
  async create(tableName, data) {
    return this.connection(tableName).insert(data);
  }
  async delete(tableName, id) {
    console.log("borrando");
    return this.connection(tableName).where("id", id).del();
  }
  async update(tableName, id, data) {
    return this.connection(tableName).where("id", id).update(data);
  }
  //async create(tableName, data) {
  //  return this.connection(tableName).insert(data);
  //}
  //
  //update(tableName, id, data) {
  //  return this.connection(tableName).where("id", id).update(data);
  //}
  //
  //delete(tableName, id) {
  //  return this.connection(tableName).where("id", id).del();
  //}
}

export const DBService = new DB();

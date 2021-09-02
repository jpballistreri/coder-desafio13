import knex from "knex";
import dbConfig from "../../knexfile";

class DBProductos {
  constructor() {
    const environment = process.env.NODE_ENV || "development";
    console.log(`SETTING ${environment} DB`);
    const options = dbConfig[environment];
    this.connection = knex(options);
  }

  init() {
    console.log("cargando base");
    this.connection.schema.hasTable("productos").then((exists) => {
      if (!exists) {
        console.log("Creamos la tabla productos!");

        this.connection.schema
          .createTable("productos", (mensajesTable) => {
            mensajesTable.increments("id");
            mensajesTable.string("title").notNullable();
            mensajesTable.integer("price").notNullable();
            mensajesTable.string("thumbnail").notNullable();
          })
          .then(() => {
            console.log("Done");
          });
      }
    });
  }

  async get(tableName, id) {
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
}
class DBMensajes {
  constructor() {
    const environment = process.env.NODE_ENV || "development_sqlite3";
    console.log(`SETTING ${environment} DB`);
    const options = dbConfig[environment];
    this.connection = knex(options);
  }

  init() {
    this.connection.schema.hasTable("mensajes").then((exists) => {
      if (exists) return;
      console.log("Creamos la tabla mensajes!");

      return this.connection.schema
        .createTable("mensajes", (mensajesTable) => {
          mensajesTable.increments();
          mensajesTable.string("email").notNullable();
          mensajesTable.string("date").notNullable();
          mensajesTable.string("texto");
        })
        .then(() => {
          console.log("Done");
        });
    });
  }

  async get(tableName) {
    return this.connection(tableName);
  }
  async create(tableName, data) {
    return this.connection(tableName).insert(data);
  }
}

export const DBService = new DBProductos();
export const DBMensajesSqlite = new DBMensajes();

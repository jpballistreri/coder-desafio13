exports.up = function (knex) {
  return knex.schema.createTable("productos", (productosTable) => {
    productosTable.increments();
    productosTable.string("title").notNullable();
    productosTable.integer("price").notNullable();
    productosTable.string("thumbnail").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("productos");
};

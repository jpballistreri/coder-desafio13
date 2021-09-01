const initProductos = [
  {
    id: 1,
    title: "Bateria Tama",
    price: 1400,
    thumbnail:
      "https://cdn3.iconfinder.com/data/icons/music-ultra/60/Music_Ultra_012_-_Drums-128.png",
  },
  {
    id: 2,
    title: "Guitarra Fender",
    price: 1200,
    thumbnail:
      "https://cdn0.iconfinder.com/data/icons/music-and-multimedia-8/64/guitar-instruments-music-128.png",
  },
  {
    id: 3,
    title: "Acordeon",
    price: 400,
    thumbnail:
      "https://cdn4.iconfinder.com/data/icons/two-tone-music-genres/64/MP3_genres_music_cajun-128.png",
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("productos")
    .del()
    .then(() => knex("productos").insert(initProductos));
};

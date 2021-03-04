const fetch = require('node-fetch');
const fs = require('fs/promises');

const pokeURL = 'https://pokeapi.co/api/v2/pokemon/';

function readInputFile(filePath) {
  return fs.readFile(filePath, 'utf8')
    .then(string => string.split('\n'));
}

// Turn the api response into a nice usable object that only contains the
// data that we actually care about.
function deserializePokeResponse(pokemon) {
  return {
    name: pokemon.name,
    types: pokemon.types.map(element =>
      element.type.name),
  };
}

function capitalize(word) {
  return word[0].toUpperCase() + word.substring(1);
}

function makePrettyDisplay(deserializedPokemon) {
  return {
    name: capitalize(deserializedPokemon.name),
    types: deserializedPokemon.types.join(', '),
  };
}

function logPokemonStats(poke) {
  console.log(`${poke.name}: ${poke.types}`);
}

function processPokemon(pokemonName) {
  return fetch(pokeURL + pokemonName)
    .then(response => response.json())
    .then(deserializePokeResponse)
    .then(makePrettyDisplay);
}

function processManyPokemon(pokemonNames) {
  return Promise.all(
    pokemonNames.map(processPokemon),
  );
}

//const inputFile = process.argv[2];
readInputFile('pokemon.txt')
  .then(processManyPokemon)
  .then(stats => stats.forEach(logPokemonStats));

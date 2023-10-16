const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImage = document.querySelector(".pokemon_image");

const form = document.querySelector(".form");
const input = document.querySelector(".input_search");

const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");

const audioPrev = new Audio('emerald_0003.wav');
const audioNext= new Audio('emerald_0005.wav');
const audioNotFound= new Audio('emerald_0007.wav');

let searchPokemon = 1;


const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(APIResponse.status == 200){
        const data = await APIResponse.json();
        return data;
    }
} 

const renderPokemon = async (pokemon) => {
    const data = await fetchPokemon(pokemon);
    if(data){
        searchPokemon = data.id;
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        if(searchPokemon < 650){
            pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
        }else if(searchPokemon > 649 && searchPokemon < 1011){
            pokemonImage.src = data['sprites']['front_default']
        }else{
            pokemonImage.style.display = 'none';
        }
    } else{
        audioNotFound.play()
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = "Não foi encontrado";
        pokemonNumber.innerHTML = "";
        setTimeout(()=> {
            searchPokemon = 1
            renderPokemon(searchPokemon);
        }, 1500)
        
    }
    
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    pokemon = input.value.toLowerCase();
    renderPokemon(pokemon);
    input.value = "";
}); 

buttonPrev.addEventListener('click', () => {
    audioPrev.volume = 0.2;
    audioPrev.play();
    buttonPrev.disabled = true;
    if(searchPokemon > 1){
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }else{
        searchPokemon = 1017;
        renderPokemon(searchPokemon);
    }
    setTimeout(()=> buttonPrev.disabled = false, 500)
}); 

buttonNext.addEventListener('click', () => {
    audioNext.volume = 0.2;
    audioNext.play();
    buttonNext.disabled = true;
    if(searchPokemon < 1017){
        searchPokemon += 1;
        renderPokemon(searchPokemon);
    }else{
        searchPokemon = 1;
        renderPokemon(searchPokemon);
    }
    setTimeout(()=> buttonNext.disabled = false, 500)
}); 


renderPokemon(searchPokemon);
const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImage = document.querySelector(".pokemon_image");
const pokemonType1 = document.querySelector(".pokemon_type1");
const pokemonType2 = document.querySelector(".pokemon_type2");

const form = document.querySelector(".form");
const input = document.querySelector(".input_search");

const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");
const buttonMega = document.querySelector(".btn-mega");
const buttonVoltar = document.querySelector(".btn-voltar");

const audioPrev = new Audio('./sounds/emerald_0003.wav');
const audioNext= new Audio('./sounds/emerald_0005.wav');
const audioNotFound= new Audio('./sounds/emerald_0007.wav');

let searchPokemon = 1;


const speciesName = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`);
    if(APIResponse.status == 200){
        const data = await APIResponse.json();
        return data['species']['name']
    }
}
const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(APIResponse.status == 200){
        const data = await APIResponse.json();
        return data;
    }
} 

const verificarMega = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`);
    if(APIResponse.status == 200){
        const data = await APIResponse.json();
        if(parseInt(data['varieties']['length']) > 1){
            if(data['varieties']['1']['pokemon']['name'].includes("mega")){
                buttonMega.style.visibility = 'visible';
                let url = data['varieties']['1']['pokemon']['url']
                num = url.substring(34,39);
                return num
            }else{
                buttonMega.style.visibility = 'hidden';
            }
        }else{
            buttonMega.style.visibility = 'hidden';
        }
        
    }else{
        buttonMega.style.visibility = 'hidden';
    }
}

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = "Carregando...";
    pokemonImage.style.display = 'none';
    pokemonNumber.innerHTML = "";
    pokemonType1.src = "./images/types/blank.png";
    pokemonType2.src = "./images/types/blank.png";
    try {
        const data = await fetchPokemon(pokemon);
        if(data){
            searchPokemon = data.id;
            if(searchPokemon > 0 && searchPokemon < 1018){
                buttonMega.style.visibility = 'hidden';
                mega = await verificarMega(pokemon)
            }
            pokemonImage.style.display = 'block';
            buttonVoltar.style.visibility = 'hidden'; 
            buttonPrev.style.visibility = 'visible';
            buttonNext.style.visibility = 'visible';
            if(searchPokemon < 650){
                pokemonNumber.innerHTML = data.id;
                pokemonName.innerHTML = data.name
                pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
            }else if(searchPokemon > 649 && searchPokemon < 1011){
                pokemonNumber.innerHTML = data.id;
                pokemonName.innerHTML = data.name
                pokemonImage.src = data['sprites']['front_default']
            }else if(searchPokemon > 10000){
                buttonMega.style.display = 'none';
                buttonVoltar.style.visibility = 'visible'; 
                pokemonNumber.innerHTML = "MEGA";
                pokemonName.innerHTML = data.name.split("-").join(" ");
                pokemonImage.src = data['sprites']['front_default']
                buttonVoltar.style.display = 'block';
                if(data.name.includes("mega-x")){
                    buttonPrev.style.visibility = 'hidden';  
                    buttonNext.style.visibility = 'visible';
                    nome = data['species']['name']    
                }else if(data.name.includes("mega-y")){
                    buttonPrev.style.visibility = 'visible'; 
                    buttonNext.style.visibility = 'hidden'; 
                    nome = data['species']['name'] 
                }else if(data.name.includes("mega")){
                    buttonPrev.style.visibility = 'hidden'; 
                    buttonNext.style.visibility = 'hidden';  
                    searchPokemon = pokemonOriginal
                }
            
            }
            else{
                pokemonImage.style.display = 'none';
                pokemonImage.style.display = 'none';
                pokemonNumber.innerHTML = data.id;
                pokemonName.innerHTML = data.name;
            }
            if(data['types']['length'] == 1 ){
                pokemonType2.style.display = 'none';
                pokemonType1.style.left = "36%";
                const tipo1 = data['types']['0']['type']['name']
                pokemonType1.src = "./images/types/"+tipo1+"_type.png"
            }
            else{
                pokemonType2.style.display = null;
                pokemonType1.style.left = null;
                let tipo1 = data['types']['0']['type']['name']
                pokemonType1.src = "./images/types/"+tipo1+"_type.png"
                let tipo2 = data['types']['1']['type']['name']
                pokemonType2.src = "./images/types/"+tipo2+"_type.png"
            }
            
        } else{
            audioNotFound.play()
            pokemonImage.style.display = 'none';
            pokemonName.innerHTML = "Não foi encontrado";
            pokemonNumber.innerHTML = "";
            pokemonType1.src = "./images/types/blank.png";
            pokemonType2.src = "./images/types/blank.png";
            setTimeout(()=> {
                searchPokemon = 1
                renderPokemon(searchPokemon);
            }, 1500)
            
        }
    }catch(error){
        console.error("Erro ao buscar o Pokémon:", error);
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
    if(searchPokemon > 1 || searchPokemon > 10000 && searchPokemon < 10276){ 
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
    if(searchPokemon < 1017 || searchPokemon > 10000 && searchPokemon < 10275){
        searchPokemon += 1;
        renderPokemon(searchPokemon);
    }else{
        searchPokemon = 1;
        renderPokemon(searchPokemon);
    }
    setTimeout(()=> buttonNext.disabled = false, 500)
}); 

buttonMega.addEventListener('click', () => {
    pokemonOriginal = searchPokemon
    audioNext.volume = 0.2;
    audioNext.play();
    renderPokemon(mega)
});

buttonVoltar.addEventListener('click', () => {
    pokemonOriginal = searchPokemon
    audioPrev.volume = 0.2;
    audioPrev.play();
    if(searchPokemon == 10034 || searchPokemon == 10035 || searchPokemon == 10043 || searchPokemon == 10044){
        searchPokemon = nome
    }
    renderPokemon(searchPokemon)
    buttonMega.style.display = 'block';
}); 

renderPokemon(searchPokemon);
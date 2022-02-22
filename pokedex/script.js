let allPokemon= [];
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');

const types = {
    grass: '#78c850',
    ground: '#e2bf65',
    dragon: '#6f35fc',
    fire: '#f58271',
    electric: '#f7d02c',
    fairy: '#d685ad',
    poison: '#966da3',
    bug: '#b3f594',
    water: '#6390f0',
    normal: '#d8d5d8',
    psychic: '#f95587',
    flying: '#a98ff3',
    fighting: '#c25956',
    rock: '#b6a146',
    ghost: '#735797',
    ice: '#96d9d6'
}

// Appel api
function fetchPokemonBase(){
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151").then(reponse => reponse.json()).then((allPoke) => {
        // console.log(allPokemon);
        allPoke.results.forEach((pokemon) => {
            fetchPokemonComplet(pokemon);
        });
    })


}
fetchPokemonBase();

function fetchPokemonComplet(pokemon){
    let objPokemonFull = {
        
    }
    let url = pokemon.url;
    let namePokemon = pokemon.name;

    // Données récupérées = transform la réponse du fetch en format json
    fetch(url).then(reponse => reponse.json()).then((pokeData) =>{
        console.log(pokeData);
        objPokemonFull.picture = pokeData.sprites.front_default;
        objPokemonFull.type = pokeData.types.map((type) => type.type.name);
        // objPokemonFull.type = pokeData.types[0].type.name;
        console.log(objPokemonFull.type);
        objPokemonFull.id = pokeData.id;

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${namePokemon}`).then(reponse => reponse.json()).then((pokeData) => {

            console.log(pokeData);
            objPokemonFull.name = pokeData.names[4].name;
            allPokemon.push(objPokemonFull);

            if(allPokemon.length === 151){
                tableauFin = allPokemon.sort((a,b) => {
                    return a.id - b.id;
                }).slice(0, 21);

                createCard(tableauFin);
                chargement.style.display="none";
            }
        })
    }); 
}

// Création des cartes
function createCard(arr){
    for(let i = 0; i < arr.length; i++){

        const carte = document.createElement('li');
        let couleur = types[arr[i].type[0]];
        let couleurSecond =  types[arr[i].type[1]];
        if(couleurSecond){
            carte.style.background = `linear-gradient(110deg, ${couleur} 50%, ${couleurSecond} 50%)`;
        }else{
            carte.style.background = couleur;
        }

        const textCarte = document.createElement('h5');
        textCarte.innerText = arr[i].name;

        const idCarte = document.createElement('p');
        idCarte.innerText = `ID# ${arr[i].id}`;

        const imgCarte = document.createElement('img');
        imgCarte.src= arr[i].picture;

        carte.appendChild(imgCarte);
        carte.appendChild(textCarte);
        carte.appendChild(idCarte);

        listePoke.appendChild(carte);
    }
}

window.addEventListener('scroll', () => { // On vient écouter l'événement scroll sur notre objet global window. 

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement; // On vient faire du destructuring et sortir trois valeurs depuis document.documentElement. On peut aller voir ça dans un nouvel onglet, appeler window dans la console et chercher document - documentElement - ScrollingElement.
    // scrollTop = scroll depuis le top
    // scrollHeight = scroll total
    // clientHeight = hauteur de la fenêtre, partie visible.
    // Puisqu'elles sont maintenant des constantes, on peu venir les loger pour voir ce qu'elles ont en elles : (pour le voir, il faut scroller):
    // console.log(scrollHeight,scrollTop,clientHeight);

    // Si la partie visible + ce qu'on scrollé depuis le top, est >= au scroll total - 20 pour que ça se déclenche un peu avant, on appelle la méthode addPoke avec 6 en paramètre pour ajouter 6 cartes.
    if(clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }

})

let index = 21; // Nombre de pokémon qu'on a déjà montré sur l'écran de base.

function addPoke(nb) {
    if(index > 151) { 
        return; // Si l'index est > à 151, on ne fait plus rien puisqu'il n'y a plus de pokémon à afficher. 
    }
    // Sinon on vient ajouter un morceau de tableau avec le nombre de pokémon qu'on a envie de venir ajouter. Ce tableau on vient l'extraire depuis notre tableau allPokemon. On slice donc à partir de index (21) jusqu'à index + le nombre passé en paramètre.
    const arrToAdd = allPokemon.slice(index, index + nb);
    console.log(index, index + nb);
    createCard(arrToAdd); // On rappelle notre fonction qui va créer des cartes avec notre morceau de tableau supplémentaire.
    index += nb;// On vient incrémenter le total de l'index avec le nombre passé en paramètre pour pouvoir répéter l'opération en partant du nouvel index par la suite.
}

// Recherche via un filtre dynamique fonctionnant dès que l'on tape dans la barre de recherche
searchInput.addEventListener('keyup', recherche);

function recherche(){

    if(index < 151) { // Si on se met à écrire, et que l'index est inférieur à 151, alors on va venir afficher les 130 autres pokémons. Oui mais si on a déjà scrollé et que l'index n'est plus égal à 21, est-ce que ça ne va pas poser problème puisqu'on vient ajouter 130 pokémons ? Et bah non. La méthode slice utilisée dans addPoke permet de gérer ça. Par exemple si notre index est de 50, elle viendra ajouter 130 à 50. En voyant que 180 > 151, la méthode slice permettra automatiquement de revenir à la longueur max du tableau (151).
        addPoke(130);
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase(); // Permet d'éviter les erreurs liées à la casse. (Maj/min) . On met toutes les valeurs passées à l'input en majuscule ici.
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5');
    
    // On gère le système de recherche : 
    for(i = 0; i < allLi.length; i++) {

        titleValue = allTitles[i].innerText; // = au nom du pokémon qui est en train de passer dans la boucle. 

        // Ne nous reste plus qu'à comparer le nom du pokémon avec ce qu'on est en train d'écrire dans l'input.
        
        // Si l'index de ce qu'on est en train de chercher est supérieur à -1, ça veut dire que ça se trouve dans notre chaîne de caractère.
        if(titleValue.toUpperCase().indexOf(filter) > -1) {
            // Du coup on lui laisse son style display flex pour qu'il reste affiché, sinon on le fait disparaître.
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }
    }
}


// Animation Input

searchInput.addEventListener('input', function(e) { // qu'est-ce que JavaScript comprend par événement "input" ? Dès qu'on va venir entrer des choses dans un input, ça va déclencher l'événement input. AddEventListener va renvoyer une fonction qui va prendre le "e" en argument, qui est un paramètre pré-conçu avec la méthode addEventListener où "e" est un objet ayant toutes les propriétés de l'évènement. Ici, l'évènement input.

    if(e.target.value !== "") { // e est notre objet ayant les propriété de l'évènement, target c'est notre input et value c'est ce qu'on rentre dedans. Donc, si on est en train d'écrire dans l'input (s'il y a à minima une seule lettre)
        e.target.parentNode.classList.add('active-input'); // On vient récupérer le parent de notre input (donc notre formulaire). On accede aux méthodes de class avec classList, et on vient ajouter la class qu'on passe en paramètre.
    } else if (e.target.value === "") { // Sinon, si la valeur de l'input est vide, on vient remove la class active-input.
        e.target.parentNode.classList.remove('active-input');
    }

})
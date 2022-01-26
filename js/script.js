//Au chargement du contenu HTML, récupère la liste de produits depuis l'API
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/products')
    .then(function(res) {
            if (res.ok) {
                console.log('SUCCESS')
                return res.json()
            }
    })
    .then(function(data) {
        usefetchResult(data)           
    })
    .catch(function(error) {
        console.log('ERROR')
    })
})

//Utilise la réponse envoyée par l'API afin de créer autant d'éléments HTML qu'il y a de produits dans la liste
function usefetchResult(data) {
    const listContainer = document.getElementById('items')

    for(let i = 0; i < data.length; i++) {
        const couch = data[i]

        const itemLink = document.createElement('a')
        itemLink.setAttribute('href', `./product.html?id=${couch._id}`) // Créé le lien de chaque produit vers sa page respective en utilisant son id
        listContainer.appendChild(itemLink)

        const itemCard = document.createElement('article')
        itemLink.appendChild(itemCard)

        const itemImg = document.createElement('img')
        itemImg.setAttribute('src', couch.imageUrl)
        itemImg.setAttribute('alt', couch.altTxt)
        itemCard.appendChild(itemImg)

        const itemName = document.createElement('h2')
        itemName.classList.add('productName')
        itemName.innerText = couch.name
        itemCard.appendChild(itemName)
        
        const itemText = document.createElement('p')
        itemText.classList.add('productDescription')
        itemText.innerText = couch.description
        itemCard.appendChild(itemText)
    } 
}
 



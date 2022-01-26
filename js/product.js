// Ces constantes récupèrent l'url de la page et l'id qu'elle contient afin de l'utiliser dans de la requête.
const urlParam = new URL(document.location)
const itemId = urlParam.searchParams.get('id')

let currentItem //On attribue les données renvoyées par l'API à cette variable


//Au chargement du contenu HTML, récupère les données du produit renvoyées par l'API en utilisant son id.
document.addEventListener('DOMContentLoaded', function() {
    fetch(`https://kanap-api.herokuapp.com/api/products/${itemId}`)
    .then(function(res) {
            if (res.ok) {
                //console.log('SUCCESS')
                return res.json()
            }
    })
    .then(function(data) {
        currentItem = data
        displayItemData(currentItem)
        verifyColor()
        verifyQuantity()
        addToCartClick()        
    })
    .catch(function(error) {
        console.log('ERROR')
    })
})

//Créé et rempli le contenu HTML avec le détail du produit renvoyé par l'API
function displayItemData(currentItem){
    let imgDiv = document.getElementsByClassName('item__img') 
        imgDiv = imgDiv[0]

        const itemImg = document.createElement('img')
        itemImg.setAttribute('src', currentItem.imageUrl)
        itemImg.setAttribute('alt', currentItem.altTxt)
        imgDiv.appendChild(itemImg)

        const itemName = document.getElementById('title')
        itemName.textContent = currentItem.name

        const itemPrice = document.getElementById('price')
        itemPrice.innerText = currentItem.price

        const itemText = document.getElementById('description')
        itemText.innerText = currentItem.description

        displayItemColors(currentItem)
}

//Ces constantes ciblent les éléments HTML permettant l'input de la couleur et de la quantité
const colorSelect = document.getElementById('colors') 
const itemQty = document.getElementById('quantity')

//Créé et rempli le contenu HTML affichant le déroulant de selection des couleurs
function displayItemColors(currentItem){
    for(let i = 0; i < currentItem.colors.length; i++) {
        const couchColor = currentItem.colors[i]

        const colorOption = document.createElement('option')
        colorOption.setAttribute('value', couchColor)
        colorOption.innerText = couchColor
        colorSelect.appendChild(colorOption)      
    }
}


let isColorTrue;    // Retourné par verifyColor puis utilisé dans addTocartClick

//verifie si input couleur est valide
function verifyColor(){
    colorSelect.addEventListener('change', function(e){
        if(e.target.value !== ""){
            isColorTrue = true
        } else {
            alert("Aucune couleur selectionnée")
            isColorTrue = false
        }
    })
}


let isQuantityTrue; // Retourné par verifyQuantity puis utilisé dans addTocartClick

//verifie si input quantité est valide
function verifyQuantity(){
    itemQty.addEventListener('change', function(e) {
        if(e.target.value > 0 && e.target.value <= 100){
            isQuantityTrue = true
        } else {
            alert('La quantité doit être comprise entre 1 et 100')
            isQuantityTrue = false
        }
    })
}

//Déclenché au clic du bouton d'ajout au panier, vérifie d'abord que couleur & quantité sont valides
function addToCartClick(){
    const itemToCart = document.getElementById('addToCart')

    itemToCart.addEventListener('click', function(e){
        if(isColorTrue == true && isQuantityTrue == true){
            checkForCart()
        } else {
            alert('La couleur et la quantité doivent être valides')
        }
    })
}

//Verifie si le localStorage existe. S'il existe, il est modifié selon certaines conditions, sinon il est créé.
function checkForCart(){
    const cartExists = localStorage.getItem("itemsInCart")
    
    //Constante pour la création d'objet à mettre dans l'array cart
    let addedItem = { //a récupérer depuis le dom ou urlparams
        id: itemId, 
        name: document.querySelector('#title').innerText,
        price: Number(document.querySelector('#price').innerText),
        img: document.getElementsByClassName('item__img')[0].getElementsByTagName('img')[0].getAttribute('src'),     // trop de piping?
        altTxt: document.getElementsByClassName('item__img')[0].getElementsByTagName('img')[0].getAttribute('alt'),
        color: colorSelect.value,
        quantity: Number(itemQty.value)
    }    

    if(cartExists != null){
        searchCartForId(cartExists, addedItem)
    } else {
        newLocalStorage(addedItem)
    }
}

//Si le localStorage existe, vérifie si un produit avec le même Id && couleur existe déjà. S'il existe, la quantité est mise, sinon il est ajouté au panier existant.
function searchCartForId(cartExists, addedItem){
    const parsedCart = JSON.parse(cartExists)
    const foundId = parsedCart.find(item => itemId == item.id && colorSelect.value == item.color)

    if(foundId){
        let newQuantityIncart  = Number(foundId.quantity) + Number(itemQty.value) 
        foundId.quantity = newQuantityIncart
        localStorage.setItem("itemsInCart", JSON.stringify(parsedCart))
    } else {
        updateLocalStorage(parsedCart, addedItem)        
    }
}


//Mets à jour le localStorage existant avec un nouvel objet
function updateLocalStorage(parsedCart, addedItem){
    parsedCart.push(addedItem)
    localStorage.setItem("itemsInCart", JSON.stringify(parsedCart))
}

//Si le localStorage n'existe pas, le premier objet et le localStorage sont créés
function newLocalStorage(addedItem){

    let newCart = []

    newCart.push(addedItem)
    localStorage.setItem("itemsInCart", JSON.stringify(newCart))
}

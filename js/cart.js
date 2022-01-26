//Ces constantes récupèrent le localStorage existant.
const cartFromLs = localStorage.getItem("itemsInCart")
const lsParsed = JSON.parse(cartFromLs)

main()

function main(){
    displayCartItems(lsParsed)
    getQuantityPrice(lsParsed)
    modifyQuantity(lsParsed)
    deleteItem(lsParsed)
    formValidation(lsParsed)
}

//Utilise le panier récupéré depuis le localStorage pour créer et remplir le contenu HTML de chaque produit présent
function displayCartItems(lsParsed){
    
    const cartContent = document.getElementById('cart__items')

    for(let i = 0; i < lsParsed.length; i++) {
        const itemInCart = lsParsed[i]

        const itemContainer = document.createElement('article')
        itemContainer.classList.add('cart__item')
        itemContainer.setAttribute('data-id', `${itemInCart.id}`)
        cartContent.appendChild(itemContainer)

        const imgContainer = document.createElement('div')
        imgContainer.classList.add('cart__item__img')
        itemContainer.appendChild(imgContainer)
            
        const itemImg = document.createElement('img')
        itemImg.setAttribute('src', `${itemInCart.img}`)
        itemImg.setAttribute('alt', `${itemInCart.altTxt}`)
        imgContainer.appendChild(itemImg)

        const dataContainer = document.createElement('div')
        dataContainer.classList.add('cart__item__content')
        itemContainer.appendChild(dataContainer)

        const textContainer = document.createElement('div')
        textContainer.classList.add('cart__item__content__titlePrice')
        dataContainer.appendChild(textContainer)

        const itemName = document.createElement('h2')
        itemName.innerText = `${itemInCart.name}`
        textContainer.appendChild(itemName)

        const itemPrice = document.createElement('p')
        itemPrice.innerText = itemInCart.price + " €"
        textContainer.appendChild(itemPrice)

        const settingsContainer = document.createElement('div')
        settingsContainer.classList.add('cart__item__content__settings')
        dataContainer.appendChild(settingsContainer)

        const quantityContainer = document.createElement('div')
        quantityContainer.classList.add('cart__item__content__settings__quantity')
        settingsContainer.appendChild(quantityContainer)

        const colorTag = document.createElement('p')
        colorTag.innerText = `${itemInCart.color}`
        quantityContainer.appendChild(colorTag)

        const qtyTag = document.createElement('p')
        qtyTag.innerText = "Qté : "
        quantityContainer.appendChild(qtyTag)

        const itemQuantity = document.createElement('input')
        itemQuantity.classList.add('itemQuantity')
        itemQuantity.setAttribute('type', 'number')
        itemQuantity.setAttribute('name', 'itemQuantity')
        itemQuantity.setAttribute('min', '1')
        itemQuantity.setAttribute('max', '100')
        itemQuantity.setAttribute('value', `${itemInCart.quantity}`)
        quantityContainer.appendChild(itemQuantity)

        const deleteContainer = document.createElement('div')
        deleteContainer.classList.add('cart__item__content__settings__delete')
        settingsContainer.appendChild(deleteContainer)

        const deleteButton = document.createElement('p')
        deleteButton.classList.add('deleteItem')
        deleteButton.innerText = "Supprimer"
        deleteContainer.appendChild(deleteButton)        
    }
}

//Récupère les quantités et les prix des différents produits du panier puis les additionne pour afficher leur total.
function getQuantityPrice(lsParsed){
        
    const totalQuantity = lsParsed.reduce((total, item) => {
        return total + item.quantity
    }, 0)

    const totalPrice = lsParsed.reduce((total, item) => {
        return total + item.price * item.quantity
    }, 0)

    const quantityDisplay = document.getElementById('totalQuantity')
    const priceDisplay = document.getElementById('totalPrice')

    quantityDisplay.innerText = totalQuantity
    priceDisplay.innerText = totalPrice
}

//Ecoute les changement de quantité et mets à jour le localStorage

function modifyQuantity(lsParsed){
    const itemQuantity = document.getElementsByClassName('itemQuantity')

    for(let i = 0; i < itemQuantity.length; i++) {
        const item = itemQuantity[i]
        
        const itemContainerId = item.closest('article').getAttribute('data-id')
        //Ici, on récupère dans foundItem les produits dans le panier qui ont un index et un id identique au produit dont on écoute l'event
        const foundItem = lsParsed.find(item => itemContainerId == item.id && item == lsParsed[i])

        item.addEventListener('change', function(e){
            const index = lsParsed.indexOf(foundItem)
            if(foundItem){
                lsParsed[index].quantity = Number(e.target.value)
                localStorage.setItem("itemsInCart", JSON.stringify(lsParsed))
                getQuantityPrice(lsParsed)
            }            
        })
    }
}



//Ecoute le clic sur le bouton "Supprimer" pour effacer le html correspondant et enlève le produit du localStorage
function deleteItem(lsParsed){
    const deleteContainer = document.getElementsByClassName('deleteItem')
    
    for(let i = 0; i < deleteContainer.length; i++) {
        const item = deleteContainer[i]

        const itemContainer = item.closest('article')
        const itemContainerId = itemContainer.getAttribute('data-id')
        const foundItem = lsParsed.find(item => itemContainerId == item.id && item == lsParsed[i])

        item.addEventListener('click', function(e) {
            const index = lsParsed.indexOf(foundItem)

            if(foundItem){
                itemContainer.remove()
                lsParsed.splice(index, 1)
                localStorage.setItem("itemsInCart", JSON.stringify(lsParsed))
                getQuantityPrice(lsParsed)
            }
        })
    }
}

//Au clic du bouton submit du formulaire, si les champs sont tous valides, un objet contact est créé et ajouté à l'objet order qui sera envoyé dans la requête à l'API
function formValidation(lsParsed) {

    const form = document.getElementsByClassName('cart__order__form')[0]
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const address = document.getElementById('address')
    const city = document.getElementById('city')
    const email = document.getElementById('email')

    form.addEventListener('submit', function(e) {
        e.preventDefault()
        	
        let contact
        let order

        let products = lsParsed.map((item) => {
            return item.id
        })

        if(checkInputs()) {            
            
            contact = {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
            }

            order = {contact, products}
            postOrder(order)
        } else {
            alert('Un des champs est invalide')
        }        
    })
}

//Si les fonctions de validation des formulaires sont tous valides, retourne vrai
function checkInputs() {

    const firstNameValue = firstName.value
    const lastNameValue = lastName.value
    const addressValue = address.value
    const cityValue = city.value
    const emailValue = email.value

    const firstNameMsg = document.getElementById('firstNameErrorMsg')
    const lastNameMsg = document.getElementById('lastNameErrorMsg')
    const addressMsg = document.getElementById('addressErrorMsg')
    const cityMsg = document.getElementById('cityErrorMsg')
    const emailMsg = document.getElementById('emailErrorMsg')


    if(checkFormInput(firstNameValue, firstNameMsg) && checkFormInput(lastNameValue, lastNameMsg) && checkAddress(addressValue, addressMsg) && checkFormInput(cityValue, cityMsg) && checkEmail(emailValue, emailMsg)) {
        return true
    } else {
        return false
    }
}

//Indique un message d'erreur si les champs sont vides ou les caractères ne respectent pas la regex utilisée, sinon retourne vrai
function checkFormInput(targetValue, errorDisplay){

    if(targetValue == '') {
        firstNameMsg.innerText = 'Ce champ est requis !'
    } else if (!nameCityRegex(targetValue)) {
        errorDisplay.innerText = 'Des caractères sont invalides !'
    } else {
        errorDisplay.innerText = 'Champ valide'
        return true
    }
}

//Indique un message d'erreur si les champs sont vides ou les caractères ne respectent pas la regex utilisée, sinon retourne vrai
function checkAddress(targetValue, errorDisplay){

    if(targetValue == '') {
        errorDisplay.innerText = 'Ce champ est requis !'
    } else if (!addressRegex(targetValue)) {
        errorDisplay.innerText = 'Des caractères sont invalides !'
    } else {
        errorDisplay.innerText = 'Champ valide'
        return true
    }
}

//Indique un message d'erreur si les champs sont vides ou les caractères ne respectent pas la regex utilisée, sinon retourne vrai
function checkEmail(targetValue, errorDisplay){

    if(targetValue == '') {
        errorDisplay.innerText = 'Ce champ est requis !'
    } else if (!emailRegex(targetValue)) {
        errorDisplay.innerText = 'Des caractères sont invalides !'
    } else {
        errorDisplay.innerText = 'Champ valide'
        return true
    }
}

//Valide le nom, prénom et ville
function nameCityRegex(nameCityValue){
    return /^[A-Z-a-z\s]{3,40}$/.test(nameCityValue)
}
//Valide l'adresse postale
function addressRegex(addressValue){
    return /^([0-9]* [A-Za-zàâäéèêëïîôöùûüÿçœ,\.\-' ]*)$/.test(addressValue)
}
//Valide l'email
function emailRegex(emailValue){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)
}

//Envoi à l'API l'objet contenant les données du formulaire et un array contenant tous les id produit du panier
function postOrder(order) {
    let orderId
    fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: { 
    'Accept': 'application/json', 
    'Content-Type': 'application/json' 
    },
        body: JSON.stringify(order)
    })
    .then(function(res) {
        if (res.ok) {
            console.log('SUCCESS')
            return res.json()
        }
    })
    //Une fois la réponse de l'API reçue, le localStorage est vidé et on récupère le numéro de commande dans la variable orderId
    .then(function(data) {
        orderId = data.orderId
        localStorage.clear()
    })
    //On redirige vers la page de confirmation en spécifiant orderId comme variable dans l'url
    .then(function() {
        document.location.href = `./confirmation.html?orderId=${orderId}`
    })
    .catch(function(error) {
        console.log('ERROR')
    })
}


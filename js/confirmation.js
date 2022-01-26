let urlParam = new URL(document.location)
let orderId = urlParam.searchParams.get('orderId')

main()

function main() {
    displayOrderId()
}
//On récupère le numéro de commande dans la variable orderId de l'URL et on l'affiche
function displayOrderId() {
    const orderIdContainer = document.getElementById('orderId')
    orderIdContainer.innerText = orderId
}
let customer = {
    table: "",
    hour: "",
    orders: []
}

const categories = {
    1: "Comida",
    2: "Bebidas",
    3: "Sobremesas"
}

const btnSaveCustomer = document.querySelector("#save-customer");
btnSaveCustomer.addEventListener("click", saveCustomer)

function saveCustomer() {

    const table = document.querySelector("#table").value
    const hour = document.querySelector("#hour").value

    //verify empty imputs

    const emptyImputs = [table, hour].some(field => field === "");

    if (emptyImputs) {
        //alert exist
        const existAlert = document.querySelector(".invalid-feedback")
        if (!existAlert) {
            const alert = document.createElement("div")
            alert.classList.add("invalid-feedback", "d-block", "text-center")
            alert.textContent = "Todos os campos são obrigatórios"
            document.querySelector('.modal-body form').appendChild(alert)

            setTimeout(() => {
                alert.remove()
            }, 1500);
        }
        return;
    }
    //assign form data to customer
    customer = { ...customer, table, hour }

    //close modal
    const modalForm = document.querySelector("#formulario")
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm)
    modalBootstrap.hide();

    //show sections
    showSections();

    //get menu
    getMenu()

}

function showSections() {
    const hiddenSections = document.querySelectorAll('.d-none')
    hiddenSections.forEach(section => section.classList.remove("d-none"))
}

function getMenu() {
    const url = 'http://localhost:3000/menu'

    fetch(url)
        .then(response => response.json())
        .then(result => showMenu(result))
        .catch(error => console.log(error))
}

function showMenu(menu) {
    const content = document.querySelector(".conteudo")

    menu.forEach(menuItem => {
        const row = document.createElement("div")
        row.classList.add('row', 'py-3', 'border-top')

        const name = document.createElement('div')
        name.classList.add('col-md-4')
        name.textContent = menuItem.name

        const price = document.createElement('div')
        price.classList.add('col-md-3', 'fw-bold')
        price.textContent = `R$ ${menuItem.cost}`

        const category = document.createElement('div')
        category.classList.add('col-md-3')
        category.textContent = categories[menuItem.category]

        const inputQuantity = document.createElement("INPUT")
        inputQuantity.type = 'number';
        inputQuantity.min = 0;
        inputQuantity.value = 0;
        inputQuantity.id = `item-${menuItem.id}`;
        inputQuantity.classList.add('form-control')
        //get menu item and quantity added
        inputQuantity.onchange = function(){
            const quantity = parseInt(inputQuantity.value)
            createOrder({...menuItem, quantity})
        }


        const addInput = document.createElement("div")
        addInput.classList.add('col-md-2')

        addInput.appendChild(inputQuantity)


        row.appendChild(name)
        row.appendChild(price)
        row.appendChild(category)
        row.appendChild(addInput)

        content.appendChild(row)
    })
}

function createOrder(items){
    let {orders} = customer
    //verify qtty > 0
    if(items.quantity > 0){
       customer.orders = [...orders, items]
    }else{
        console.log("no es mayor");
    }

    console.log(customer.orders);
    
    
}
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
    const content = document.querySelector(".content")

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

        //verify if item exist
       if(orders.some(item => item.id === items.id)){
        //if item exist, update qtty
        const updateOrder = orders.map(item =>{
            if( item.id === items.id){
                item.quantity = items.quantity
            }
            return item
        })
        //new customer.orders array
        customer.orders = [...updateOrder]
       }else{
        //if item exist
        customer.orders = [...orders, items]
       }
        
       
    }else{
        const result = orders.filter(item => item.id !== items.id)

        customer.orders = [...orders]
    }

    cleanHtml()

    // show customer orders
    showOrders()
    
    
}

function showOrders(){


    const content = document.querySelector("#summary .content")

    const summaryOrder = document.createElement("div")
    summaryOrder.classList.add("col-md-6", 'card', 'py-5', 'px-3', 'shadow')


    const table = document .createElement("P")
    table.textContent = 'Mesa: ';
    table.classList.add("fw-bold")


    const tableSpan = document.createElement("span")
    tableSpan.textContent = customer.table
    tableSpan.classList.add("fw-normal")

    const hour = document .createElement("P")
    hour.textContent = 'Hora: ';
    hour.classList.add("fw-bold")


    const hourSpan = document.createElement("span")
    hourSpan.textContent = customer.hour
    hourSpan.classList.add("fw-normal")


    table.appendChild(tableSpan)
    hour.appendChild(hourSpan)

    const heading = document.createElement("h3")
    heading.textContent="Items Pedidos"
    heading.classList.add("my-4",'text-center')

    const group = document.createElement("ul")
    group.classList.add('list-group')

    const {orders} = customer

    orders.forEach(item => {
        const {name, quantity, cost, id} = item

        const list = document.createElement("li")
        list.classList.add('list-group-item')

        const nameIt = document.createElement("h4")
        nameIt.classList.add("my-4")
        nameIt.textContent= name

        const quantityItem = document.createElement("p")
        quantityItem.classList.add("fw-bold")
        quantityItem.textContent = 'Quantidade: '

        const quantityValue = document.createElement("span")
        quantityValue.classList.add("fw-normal")
        quantityValue.textContent = quantity

        const priceItem = document.createElement("p")
        priceItem.classList.add("fw-bold")
        priceItem.textContent = 'Preço: '

        const priceValue = document.createElement("span")
        priceValue.classList.add("fw-normal")
        priceValue.textContent = `$${cost}`

        priceItem.appendChild(priceValue)
        quantityItem.appendChild(quantityValue)
        
        list.appendChild(nameIt)
        list.appendChild(quantityItem)
        list.appendChild(priceItem)



        group.appendChild(list)
        
    })


    summaryOrder.appendChild(table)
    summaryOrder.appendChild(hour)
    summaryOrder.appendChild(heading)
    summaryOrder.appendChild(group)

    content.appendChild(summaryOrder)
}

function cleanHtml(){
    const content = document.querySelector("#summary .content")

    while (content.firstChild){
        content.removeChild(content.firstChild)
    }
}
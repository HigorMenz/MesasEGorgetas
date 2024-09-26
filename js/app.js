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
        inputQuantity.onchange = function () {
            const quantity = parseInt(inputQuantity.value)
            createOrder({ ...menuItem, quantity })
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

function createOrder(items) {
    let { orders } = customer
    //verify qtty > 0
    if (items.quantity > 0) {

        //verify if item exist
        if (orders.some(item => item.id === items.id)) {
            //if item exist, update qtty
            const updateOrder = orders.map(item => {
                if (item.id === items.id) {
                    item.quantity = items.quantity
                }
                return item
            })
            //new customer.orders array
            customer.orders = [...updateOrder]
        } else {
            //if item exist
            customer.orders = [...orders, items]
        }


    } else {
        const result = orders.filter(item => item.id !== items.id)

        customer.orders = [...result]
    }

    cleanHtml()

    // show customer orders.
    showOrders()


}

function showOrders() {


    const content = document.querySelector("#summary .content")

    const summaryOrder = document.createElement("div")
    summaryOrder.classList.add("col-md-6", 'card', 'py-2', 'px-3', 'shadow')


    const table = document.createElement("P")
    table.textContent = 'Mesa: ';
    table.classList.add("fw-bold")


    const tableSpan = document.createElement("span")
    tableSpan.textContent = customer.table
    tableSpan.classList.add("fw-normal")

    const hour = document.createElement("P")
    hour.textContent = 'Hora: ';
    hour.classList.add("fw-bold")


    const hourSpan = document.createElement("span")
    hourSpan.textContent = customer.hour
    hourSpan.classList.add("fw-normal")


    table.appendChild(tableSpan)
    hour.appendChild(hourSpan)

    const heading = document.createElement("h3")
    heading.textContent = "Items Pedidos"
    heading.classList.add("my-4", 'text-center')

    const group = document.createElement("ul")
    group.classList.add('list-group')

    const { orders } = customer

    orders.forEach(item => {
        const { name, quantity, cost, id } = item

        const list = document.createElement("li")
        list.classList.add('list-group-item')

        const nameIt = document.createElement("h4")
        nameIt.classList.add("my-4")
        nameIt.textContent = name

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
        priceValue.textContent = `R$ ${cost}`



        const totalItems = document.createElement("p")
        totalItems.classList.add("fw-bold")
        totalItems.textContent = 'Total: '

        const totalValue = document.createElement("span")
        totalValue.classList.add("fw-normal")
        totalValue.textContent = itemsConsumed(cost, quantity)

        //delete item
        const btnDelete = document.createElement('button')
        btnDelete.classList.add('btn', 'btn-danger')
        btnDelete.textContent = 'Remover Item'
        btnDelete.onclick = function () {
            removeItem(id)
        }


        priceItem.appendChild(priceValue)
        quantityItem.appendChild(quantityValue)
        totalItems.appendChild(totalValue)

        list.appendChild(nameIt)
        list.appendChild(quantityItem)
        list.appendChild(priceItem)
        list.appendChild(totalItems)
        list.appendChild(btnDelete)



        group.appendChild(list)

    })

    summaryOrder.appendChild(heading)
    summaryOrder.appendChild(table)
    summaryOrder.appendChild(hour)
    summaryOrder.appendChild(group)

    content.appendChild(summaryOrder)

    //show form tips

    formTips()
}

function cleanHtml() {
    const content = document.querySelector("#summary .content")

    while (content.firstChild) {
        content.removeChild(content.firstChild)
    }
}

function itemsConsumed(cost, quantity) {
    return `R$ ${cost * quantity}`
}

function removeItem(id) {

    const { orders } = customer
    const result = orders.filter(item => item.id !== id)
    customer.orders = [...result]

    cleanHtml()

    if(customer.orders.length){

        showOrders()
    }else{
        emptyOrder()
    }
    

    //the item was deleted so the quantity needs to be changed to 0
    const removedItem = `#item-${id}`
    const removedInput = document.querySelector(removedItem)
    removedInput.value = 0
   
    
}

function emptyOrder(){
    const content = document.querySelector('#summary .content')

    const text = document.createElement('p')
    text.classList.add('text-center')
    text.textContent = ('Adicione items ao pedido')

    content.appendChild(text)

}


function formTips(){
    const content = document.querySelector('#summary .content')

    const form = document.createElement("div")
    form.classList.add('col-md-6' , 'form')

    const divForm = document.createElement('div')
    divForm.classList.add("card","py-2","px-3","shadow","gap-3")




    const heading = document.createElement('h3')
    heading.classList.add('my-4','text-center')
    heading.textContent = 'Gorjeta'
    
    //tips 10%

    const radio10 = document.createElement('input')
    radio10.type = "radio"
    radio10.name = 'gorjeta'
    radio10.value = "10"
    radio10.classList.add("form-check-input");
    radio10.onclick = calcTips

    const radio10Label = document.createElement("label")
    radio10Label.textContent = "10%"
    radio10.classList.add("form-check-label")

    const radio10Div = document.createElement("div")
    radio10Div.classList.add("form-check")


    radio10Div.appendChild(radio10)
    radio10Div.appendChild(radio10Label)

    //tips 25%
    const radio25 = document.createElement('input')
    radio25.type = "radio"
    radio25.name = 'gorjeta'
    radio25.value = "25"
    radio25.classList.add("form-check-input");
    radio25.onclick = calcTips

    const radio25Label = document.createElement("label")
    radio25Label.textContent = "25%"
    radio25.classList.add("form-check-label")

    const radio25Div = document.createElement("div")
    radio25Div.classList.add("form-check")


    radio25Div.appendChild(radio25)
    radio25Div.appendChild(radio25Label)

      //tips 50%
      const radio50 = document.createElement('input')
      radio50.type = "radio"
      radio50.name = 'gorjeta'
      radio50.value = "50"
      radio50.classList.add("form-check-input");
      radio50.onclick = calcTips
  
      const radio50Label = document.createElement("label")
      radio50Label.textContent = "50%"
      radio50.classList.add("form-check-label")
  
      const radio50Div = document.createElement("div")
      radio50Div.classList.add("form-check")
  
  
      radio50Div.appendChild(radio50)
      radio50Div.appendChild(radio50Label)
  


    divForm.appendChild(heading)
    divForm.appendChild(radio10Div)
    divForm.appendChild(radio25Div)
    divForm.appendChild(radio50Div)
   
    form.appendChild(divForm)


    content.appendChild(form)
}

function calcTips(){
    const {orders} = customer
    let subTotal = 0

    orders.forEach( item => {
        subTotal += item.quantity *  item.cost
    })

    const selectTips = document.querySelector('[name="gorjeta"]:checked').value
   

    const tips = ((subTotal * parseInt(selectTips))/100)
    
    const total = subTotal + tips

    totalHtml(subTotal, total, tips)

    
}

function totalHtml(subTotal, total, tips){
  

    const divTotal = document.createElement('div')
    divTotal.classList.add('bill-total', 'my-5')
    //items consumed
    const subTotalP = document.createElement("p")
    subTotalP.classList.add('fs-6','fw-bold', 'mt-3')
    subTotalP.textContent = 'Valor dos items pedidos: '

    const subTotalSpan = document.createElement('span')
    subTotalSpan.classList.add('fw-normal')
    subTotalSpan.textContent = `R$ ${subTotal}`

    subTotalP.appendChild(subTotalSpan)

    //tips
    const tipsTotalP = document.createElement("p")
    tipsTotalP.classList.add('fs-6','fw-bold', 'mt-3')
    tipsTotalP.textContent = 'Valor da gorjeta: '

    const tipsTotalSpan = document.createElement('span')
    tipsTotalSpan.classList.add('fw-normal')
    tipsTotalSpan.textContent = `R$ ${tips}`

    tipsTotalP.appendChild(tipsTotalSpan)

    //total
    const totalValueP = document.createElement("p")
    totalValueP.classList.add('fs-6','fw-bold', 'mt-3')
    totalValueP.textContent = 'Valor total a pagar: '

    const totalValueSpan = document.createElement('span')
    totalValueSpan.classList.add('fw-normal')
    totalValueSpan.textContent = `R$ ${total}`

    totalValueP.appendChild(totalValueSpan)

    //clear html if tips are changed
    const clearTotal = document.querySelector('.bill-total')
    if(clearTotal){
        clearTotal.remove()
    }

    divTotal.appendChild(subTotalP)
    divTotal.appendChild(tipsTotalP)
    divTotal.appendChild(totalValueP)

    const form = document.querySelector(".form > div")
    form.appendChild(divTotal)


}
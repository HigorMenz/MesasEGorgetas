let client = {
    table: "",
    hour: "",
    orders: []
}

const btnSaveClient = document.querySelector("#save-client");
btnSaveClient.addEventListener("click", saveClient)

function saveClient() {

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
    //assign form data to client
    client = { ...client, table, hour }

    //close modal
    const modalForm = document.querySelector("#formulario")
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm)
    modalBootstrap.hide();

    //show sections
    showSections();

    //get menu
    getMenu()

}

function showSections(){
    const hiddenSections = document.querySelectorAll('.d-none')
    hiddenSections.forEach(section => section.classList.remove("d-none"))
}

function getMenu(){
    const url = 'http://localhost:3000/menu'

    fetch(url)
        .then(response => response.json())
        .then(result => showMenu(result))
        .catch(error => console.log(error))
}

function showMenu(menu){
    const content = document.querySelector(".conteudo")

    menu.forEach( menuItem =>{
        const row = document.createElement("div")
        row.classList.add('row')

        const name = document.createElement('div')
        name.classList.add('col-md-4')
        name.textContent = menuItem.name

        row.appendChild(name)

        content.appendChild(row)
    })
}
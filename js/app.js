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
    
    client = {
        ...client, table, hour
    }

    console.log(client);
    


}


const url = location.search // traemos url en srt
const params = new URLSearchParams(url) // pasamos a un obj de tipo URLsearch params, para usar sus propiedades
const id = params.get("id") // traemos el valor 

const eventos = data.events 

const $detail = document.getElementById('detail-index')


const eventoEncontrado = eventos.find(evento => evento._id === id)

let estimateOrAssistance
    if(eventoEncontrado.assistance){
        estimateOrAssistance = 'Assistance: ' + eventoEncontrado.assistance
    }else if(eventoEncontrado.estimate){
        estimateOrAssistance = 'Estimate: ' + eventoEncontrado.estimate
    }

function renderDetalleEvento(){
    let template = ''
    $detail.innerHTML = `
    <div class="row  my-4 justify-content-between align-items-md-center">
        <div class="col-md-6">
            <img src="${eventoEncontrado.image}" class="img-fluid rounded-2 p-3" alt="...">
        </div>
        <div class="col-md-6">
            <div class="card-body tarjeta-details">
                <h5 class="card-title text-center">${eventoEncontrado.name}</h5>
                <p class="text-center">Date: 2022-10-15</p>
                <p class="card-text text-center">Category: ${eventoEncontrado.category}</p>
                <p class="card-text text-center">Place: ${eventoEncontrado.place}</p>
                <p class="card-text text-center">Capacity: ${eventoEncontrado.capacity}</p>
                <p class="card-text text-center">${estimateOrAssistance}</p>
                <p class="card-text text-center">${eventoEncontrado.description}</p>
                <p class="card-text text-center">Price: <span class="price-color">USD ${eventoEncontrado.price}</span></p>
            </div>
        </div>
    </div>
    `
    template = $detail
    return template
}

renderDetalleEvento()
fetch('https://mindhub-xj03.onrender.com/api/amazing')
    .then(reponse => reponse.json())
    .then(data => {
        let eventos = data.events
        let fecha = data.currentDate
        const eventosP = ePasados(eventos, fecha)
        cardsPast(eventosP, seccion)

        let todasLasCategorias = Array.from(new Set(categoriasFiltradas(eventosP)))
        $check.innerHTML = generarCheckbox(todasLasCategorias)

        $check.addEventListener('change', cruzarBusqueda)
        $input.addEventListener('input', cruzarBusqueda)

        function cruzarBusqueda(){
            const filtroInput = busquedaInputText($input, eventosP)
            const filtroCheck = busquedaCheck($input,filtroInput, eventosP)
            if(filtroCheck.length === 0){
                return renderizar(mensajeNotFound(), 'section-pastEvents')
            }
            return renderizar(generarCards(filtroCheck), 'section-pastEvents')
        }
    })
    .catch(error => console.log(error))


function ePasados(even){
    let past = []
    
    for(let evento of even){
        if(evento.date < fechaActual){
            past.push(evento)
        }
    }
    return past
}

const seccion = document.getElementById('section-pastEvents')

function cardsPast(arr, lugar){
    let div = document.createElement('div');
    div.classList.add('row', 'row-cols-2', 'container-fluid', 'px-0', 'mx-auto', 'justify-content-center', 'justify-content-lg-evenly', 'gap-3', 'my-4')
    for(let evento of arr){
        div.innerHTML +=
             `
                <div class="card col-5 col-lg-3 col-xl-2">
                    <div class="p-2 pt-md-3 tarjeta">
                        <img src=${evento.image} class="img-tarjeta" alt="...">
                        <div class="">
                            <h5 class="pt-1 titulo-tarjeta">${evento.name}</h5>
                            <p class="texto-tarjeta">${evento.description.slice(0,40)}...</p>
                            <p class="text-center pt-2 mb-0">Price: <span class="text-success">USD ${evento.price}</span></p>
                            <p class="texto-tarjeta">Date: ${evento.date}</p>
                            <div class="justify-content-center d-flex">
                                <a href="./details.html?id=${evento._id}" class="btn btn-danger boton-tarjeta">View more</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }

    lugar.append(div)
}



/*  */

const $check = document.getElementById('checks-past')
const $input = document.getElementById('busqueda-input-past')


function categoriasFiltradas(events){
    const categorias = events.map(event => event.category)
    return categorias
}



function generarCheckbox(categorias){

    let template = ''
    categorias.forEach( categoria => {
        template += `
        <div class="form-check col-lg-auto col-6 p-lg-0 d-flex justify-content-center justify-content-lg-start">
            <input value="${categoria}" type="checkbox" name="category2" class="check-box form-check-input" id="${categoria}">
            <label class="form-check-label ps-3 ps-lg-2 col-lg-auto label-formulario col-8" for="${categoria}">${categoria}</label>
        </div>
        `
    })
    return template
}



function obtenerCheckeados(){
    const checkbox = document.querySelectorAll( 'input[type="checkbox"]:checked' )
    const checkboxArray = Array.from(checkbox)
    return checkboxArray
}

function renderizar(template, donde){
    document.getElementById(donde).innerHTML = template
}

function generarCards(eventosP){
    let aux = ''
    let div = document.createElement('div')
    div.classList.add('row', 'row-cols-2', 'container-fluid', 'px-0', 'mx-auto', 'justify-content-center', 'justify-content-lg-evenly', 'gap-3', 'my-4')
    eventosP.forEach(evento => {
        aux += `
        <div class="card col-5 col-lg-3 col-xl-2">
            <div class="p-2 pt-md-3 pt-md-3 tarjeta">
                <img src=${evento.image} class="img-tarjeta" alt="...">
                <div class="">
                    <h5 class="pt-1 titulo-tarjeta">${evento.name}</h5>
                    <p class="texto-tarjeta">${evento.description.slice(0,40)}...</p>
                    <p class="text-center pt-2 mb-0">Price: <span class="text-success">USD ${evento.price}</span></p>
                    <p class="texto-tarjeta">Date: ${evento.date}</p>
                    <div class="justify-content-center d-flex">
                        <a href="./details.html" class="btn btn-danger boton-tarjeta">View more</a>
                    </div>
                </div>
            </div>
        </div>
        `
    })
    div.innerHTML = aux
    let template = div.outerHTML;
    return template
}

function mensajeNotFound(){
    template = ''
    let div = document.createElement('h2')
    template = `
        <h2 class="not-found">Results Not Found</h2>
    `
    div.innerHTML = template
    return template
}


function busquedaCheck(valueInput, listaEventos, todosLosEventos){
    const checkeados = obtenerCheckeados()
    const checkValue = checkeados.map(checkeados => checkeados.value)

    const eventosCheck = todosLosEventos.filter(evento => checkValue.includes(evento.category))

    if(eventosCheck.length > 0){
        const filtroCruzado = eventosCheck.filter(evento => evento.name.toLowerCase().startsWith(valueInput.value.toLowerCase()))
        return filtroCruzado
    }else{
        return listaEventos
    }
}

function busquedaInputText(busquedaInput, todosLosEventos){
    let inputFiltrado = todosLosEventos.filter(evento => evento.name.toLowerCase().startsWith( busquedaInput.value.toLowerCase() ))
    return inputFiltrado
}


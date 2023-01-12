const $table = document.getElementById('main-table')

fetch('https://mindhub-xj03.onrender.com/api/amazing')
    .then(reponse => reponse.json())
    .then(data => {
        const eventos = data.events
        const currentDate = data.currentDate
        const eventosFuturos = eventos.filter(evento => evento.estimate)
        const eventosPasados = eventos.filter(evento => evento.assistance)
        const categorias = eventos.map(evento => evento.category)
        const categoriasSinRepetir =  Array.from(new Set(categorias))

        const gananciasDeEventosFuturos =  gananciasEventos(eventosFuturos, currentDate) 

        const gananciasDeEventosPasados =  gananciasEventos(eventosPasados, currentDate)

        const porcentajeFuturo = porcentajeDeGanancia(eventosFuturos)
        const porcentajePasado = porcentajeDeGanancia(eventosPasados)
       
        let mayor = ((eventosFuturos[0].estimate / eventosFuturos[0].capacity) * 100)

        for (let i = 0; i < eventosFuturos.length; i++) {
            if(((eventosFuturos[i].estimate / eventosFuturos[i].capacity) * 100) > mayor){
                mayor = ((eventosFuturos[i].estimate / eventosFuturos[i].capacity) * 100) 
            }
        }

        let menor = ((eventosPasados[0].assistance / eventosPasados[0].capacity) * 100)

        for (let i = 0; i < eventosPasados.length; i++) {
            if(((eventosPasados[i].assistance / eventosPasados[i].capacity) * 100) < menor){
                menor = ((eventosPasados[i].assistance / eventosPasados[i].capacity) * 100)
            }
        }
        
        let mayorPorcentaje = eventos.find(evento => (evento.estimate / evento.capacity) * 100 === mayor || (evento.assistance / evento.capacity) * 100 === mayor)
        let menorPorcentaje = eventos.find(evento => (evento.estimate / evento.capacity) * 100 === menor || (evento.assistance / evento.capacity) * 100 === menor)

        let mayorCapacidad = eventos[0].capacity

        for (let i = 0; i < eventos.length; i++) {
            if(eventos[i].capacity > mayorCapacidad){
                mayorCapacidad = eventos[i].capacity
            }
        }
        let eventoMayorCapacidad = eventos.find(evento => evento.capacity === mayorCapacidad)

        renderizar(crearTabla(categoriasSinRepetir, gananciasDeEventosFuturos, porcentajeFuturo, gananciasDeEventosPasados, porcentajePasado, mayorPorcentaje, menorPorcentaje, eventoMayorCapacidad), 'main-table') // recibe dos argumentos (template y contenedor)
    })
    .catch(error => console.log(error))


function porcentajeDeGanancia(eventos){
    if(eventos[0].estimate){
        const porcentaje = eventos.map(evento => Math.round( (((evento.estimate / evento.capacity) * 100) * 100)) / 100 );
        return porcentaje
    }else{
        const porcentaje = eventos.map(evento => Math.round( (((evento.assistance / evento.capacity) * 100) * 100)) / 100 );
        return porcentaje
    }
}

function gananciasEventos(eventos, fechaActual){
    if(eventos[0].estimate){
        const ganancias = eventos.filter(evento => evento.date > fechaActual).map(evento => evento.estimate * evento.price)
        return ganancias
    }else{
        const ganancias = eventos.filter(evento => evento.date < fechaActual).map(evento => evento.assistance * evento.price)
        return ganancias
    }
}

function eventosTabla(categorias, ganancias, porcentaje){
    let template = ''

    for (let i = 0; i < categorias.length; i++) {
        template += 
            `
                <tr>
                    <td class="th">${categorias[i]}</td>
                    <td class="th">${ganancias[i]}</td>
                    <td class="th">${porcentaje[i]}</td>
                </tr>
            
            `
    }
    return template
}

function crearTabla(categorias, gananciasDeEventosFuturos, porcentajeFuturo, gananciasPasadas, porcentajePasado,  porcentajeMasAlto, porcentajeMasBajo, mayorCapacidad){
    let template = ''
    template = `
    <table>
        <thead>
            <tr>
                <th class="titulo-tabla" colspan="3">Events statistics</th>
            </tr>
            <tr>
                <th class="th">Events with highest percentage of attendance</th>
                <th class="th">Events with the lowest percentage of attendance</th>
                <th class="th">Event with larger capacity</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="th">${porcentajeMasAlto.name}</td>
                <td class="th">${porcentajeMasBajo.name}</td>
                <td class="th">${mayorCapacidad.name}</td>
            </tr>
        </tbody>

        <thead>
            <tr>
                <th class="titulo-tabla" colspan="3">Upcoming events statistics by category</th>
            </tr>
            <tr>
                <th class="th">Categories</th>
                <th class="th">Revenues</th>
                <th class="th">Percentage of attendance</th>
            </tr>
        </thead>
        <tbody>
            ${eventosTabla(categorias, gananciasDeEventosFuturos, porcentajeFuturo)}
        </tbody>

        <thead>
            <tr>
                <th class="titulo-tabla" colspan="3">Past events statistics by category</th>
            </tr>
            <tr>
                <th class="th">Categories</th>
                <th class="th">Revenues</th>
                <th class="th">Percentage of attendance</th>
            </tr>
        </thead>
        <tbody>
            ${eventosTabla(categorias, gananciasPasadas, porcentajePasado)}
        </tbody>
    </table>
    `
    return template
}

function renderizar(template, contenedor){
    document.getElementById(contenedor).innerHTML = template
}
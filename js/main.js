const { createApp } = Vue

createApp({
    data(){
        return {
            eventos : [],
            categorias: [],
            checkeados: [],
            valorDelInput: "",
            eventosFiltrados: []
        }
    },
    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(response => response.json())
            .then(data => {
                console.log(window.location.pathname)
                this.categorias = [... new Set(data.events.map(evento => evento.category))]
                if(window.location.pathname === "/views/index.html"){
                    this.eventos = data.events
                    this.eventosFiltrados = this.eventos
                }else if(window.location.pathname === "/views/upComingEvents.html"){
                    const eventosFuturos = data.events.filter(evento => evento.estimate)
                    this.eventos = eventosFuturos
                }else if(window.location.pathname === "/views/pastEvents.html"){
                    const eventosPasados = data.events.filter(evento => evento.assistance)
                    this.eventos = eventosPasados
                }
            })
            .catch(error => console.log(error))
    },
    methods: {
        /* filtroCruzadoUpComing: function(eventosFuturos){
            let filtroInputBusquedaEF = eventosFuturos.filter(evento => evento.name.toLowerCase().includes("avengers"))
            console.log(filtroInputBusquedaEF)
            if( this.checkeados.length === 0){
                this.eventosFiltrados = filtroInputBusqueda
            }else{
                let filtroCheck = filtroInputBusqueda.filter(evento => this.checkeados.includes( evento.category ) )
                this.eventosFiltrados = filtroCheck
            }
        } */
    },
    computed: {
        filtroCruzado: function(){
            let filtroInputBusqueda = this.eventos.filter(evento => evento.name.toLowerCase().startsWith( this.valorDelInput.toLowerCase() ))
            if( this.checkeados.length === 0){
                this.eventosFiltrados = filtroInputBusqueda
            }else{
                let filtroCheck = filtroInputBusqueda.filter(evento => this.checkeados.includes( evento.category ) )
                this.eventosFiltrados = filtroCheck
            }
        }
    }
}).mount("#app")
const { createApp } = Vue

createApp({
    data(){
        return {
            eventos: [],
            mayorAsistencia: [],
            menorAsistencia: [],
            mayorCapacidad: [],
            estadFuturas: [],
            estadPasadas: [],
        }
    },
    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(response => response.json())
            .then(data => {

                let fechaActual = data.currentDate
                this.eventos = data.events
                
                const eventosPasados = data.events.filter(evento => evento.assistance)
                const eventosFuturos = data.events.filter(evento => evento.estimate)
                const gananciasPasadas = this.ganancias(eventosPasados, fechaActual)
                const gananciasFuturas = this.ganancias(eventosFuturos, fechaActual)
                const porcentajeFuturo = this.porcentajes(eventosFuturos)
                const porcentajePasado = this.porcentajes(eventosPasados)

                this.mayorAsistencia = this.eventosMayorAsistencia(eventosPasados)
                this.menorAsistencia = this.eventosMenorAsistencia(eventosPasados)
                this.mayorCapacidad = this.eventoMayorCapacidad(this.eventos)
                this.categorias = [... new Set( this.eventos.map(evento => evento.category))]

                this.estadFuturas = this.categorias.map((item, i) => ({
                    categoria: item,
                    ganancia: gananciasFuturas[i],
                    porcentaje: porcentajeFuturo[i]
                }))

                this.estadPasadas = this.categorias.map((item, i) => ({
                    categoria: item,
                    ganancia: gananciasPasadas[i],
                    porcentaje: porcentajePasado[i]
                }))
              
            })
            .catch(error => console.log(error))
    },
    methods: {
        eventosMayorAsistencia: function(eventosPasados){
            let asistencia = (eventosPasados[0].assistance /  eventosPasados[0].capacity) * 100
            let eventoMayorAsistencia = eventosPasados[0]

            eventosPasados.forEach(evento => {
                if((evento.assistance / evento.capacity) * 100 > asistencia){
                    asistencia = (evento.assistance / evento.capacity) * 100
                    eventoMayorAsistencia = evento
                }
            });
            return eventoMayorAsistencia
        },
        eventosMenorAsistencia: function(eventosPasados){
            let asistencia = (eventosPasados[0].assistance /  eventosPasados[0].capacity) * 100
            let eventoMenorAsistencia = eventosPasados[0]

            eventosPasados.forEach(evento => {
                if((evento.assistance / evento.capacity) * 100 < asistencia){
                    asistencia = (evento.assistance / evento.capacity) * 100
                    eventoMenorAsistencia = evento
                }
            });
            return eventoMenorAsistencia
        },
        eventoMayorCapacidad: function(eventos){
            let mayorCapacidad = eventos[0].capacity
            let eventoMayor = eventos[0]
            eventos.forEach(evento => {
                if(evento.capacity > mayorCapacidad){
                    mayorCapacidad = evento.capacity
                    eventoMayor = evento
                }

            });
            return eventoMayor
        },
        ganancias: function(eventos, fechaActual){
            if(eventos[0].estimate){
                const ganancias = eventos.filter(evento => evento.date > fechaActual).map(evento => evento.estimate * evento.price)
                return ganancias
            }else{
                const ganancias = eventos.filter(evento => evento.date < fechaActual).map(evento => evento.assistance * evento.price)
                return ganancias
            }
        },
        porcentajes: function(eventos){
            if(eventos[0].estimate){
                const porcentaje = eventos.map(evento => Math.round( (((evento.estimate / evento.capacity) * 100) * 100)) / 100 );
                return porcentaje
            }else{
                const porcentaje = eventos.map(evento => Math.round( (((evento.assistance / evento.capacity) * 100) * 100)) / 100 );
                return porcentaje
            }
        }
    }
}).mount("#app")
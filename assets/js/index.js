const app = Vue.createApp({
    data() {
        return {
            eventos: [],
            eventosBack: [],
            eventosPast: [],
            eventosUpcoming: [],
            arrayUpcoming: [],
            arrayPast: [],
            categoriasFiltradas: [],
            categorias: [],
            statsUpcoming: [],
            statsPast: [],
            arrayCapacidad: "",
            mayorPorcentaje: 0,
            menorPorcentaje: 0,
            capacidadMaxima: 0,
            eventoMayorPorcentaje: "",
            eventoMenorPorcentaje: "",
            urlApi: "https://amazing-events.herokuapp.com/api/events",
            buscador: "",
            fecha: "",
            identificador: (new URLSearchParams(location.search)).get("id"),
            buscado: "",
        }
    },
    created() {
        this.data(this.urlApi)
        
    },
    methods: {
        data(url) {
            fetch(url).then(res => res.json())
                .then(data => {
                    this.eventos = data.events
                    this.fecha = data.currentDate
                    this.eventosPast = this.eventos.filter(item => this.fecha > item.date)
                    this.eventosUpcoming = this.eventos.filter(item => this.fecha < item.date)
                    this.eventosBack = this.eventos
                    this.arrayUpcoming = this.eventosUpcoming
                    this.arrayPast = this.eventosPast
                    this.eventos.forEach(item => !this.categorias.includes(item.category) ? this.categorias.push(item.category) : "")
                    this.categorias.sort();
                    this.buscado = this.eventos.find(item => item._id == this.identificador)
                    this.estadisticasEventos()
                    this.upcomingStats()
                    this.pastStats()
                })
        },
        estadisticasEventos() {
            this.mayorPorcentaje = (this.arrayPast[0].assistance / this.arrayPast[0].capacity) * 100;
            this.menorPorcentaje = (this.arrayPast[0].assistance / this.arrayPast[0].capacity) * 100;
            this.arrayPast.forEach(item => {
                let resultado = (item.assistance / item.capacity) * 100;
                if (resultado > this.mayorPorcentaje) {
                    this.mayorPorcentaje = resultado
                    this.eventoMayorPorcentaje = item.name
                } else if (resultado < this.menorPorcentaje) {
                    this.menorPorcentaje = resultado
                    this.eventoMenorPorcentaje = item.name
                }
            })
            let arrayCapacidad = this.eventosBack.map(item => parseInt(item.capacity))
            let nombreCapacidad = Math.max.apply(Math, arrayCapacidad) 
            this.capacidadMaxima = this.eventosBack.find(item => nombreCapacidad == item.capacity)
        },
        upcomingStats() {
            for (let i = 0; i < this.categorias.length; i++) {
                let filtro = this.arrayUpcoming.filter(item => item.category == this.categorias[i]);
                let precio = filtro.map(item => parseInt(item.estimate) * item.price).reduce((acumulador, item) => acumulador + item, 0);
                let acumuladorEstimado = filtro.map(item => parseInt(item.estimate)).reduce((acumulador, item) => acumulador + item, 0);
                let calcularCapacidad = filtro.map(item => parseInt(item.capacity)).reduce((acumulador, item) => acumulador + item, 0);
                let calcularPorcentaje = Math.round((acumuladorEstimado * 100) / calcularCapacidad);
                let impresion = {
                    filtro: this.categorias[i],
                    total: precio,
                    calcularPorcentaje: calcularPorcentaje
                }
                this.statsUpcoming.push(impresion)
            }
        },
        pastStats() {
            for (let i = 0; i < this.categorias.length; i++) {
                let filtro = this.arrayPast.filter(item => item.category == this.categorias[i]);
                let precio = filtro.map(item => parseInt(item.assistance) * item.price).reduce((acumulador, item) => acumulador + item, 0);
                let acumuladorAsistencia = filtro.map(item => parseInt(item.assistance)).reduce((acumulador, item) => acumulador + item, 0);
                let calcularCapacidad = filtro.map(item => parseInt(item.capacity)).reduce((acumulador, item) => acumulador + item, 0);
                let calcularPorcentaje = Math.round((acumuladorAsistencia * 100) / calcularCapacidad);
                let impresion = {
                    filtro: this.categorias[i],
                    total: precio,
                    calcularPorcentaje: calcularPorcentaje
                }
                this.statsPast.push(impresion)
            }
        }
    },
    computed: {
        filtroDoble() {
            let filtro1 = this.eventosBack.filter(evento => evento.name.toLowerCase().includes(this.buscador.toLowerCase()))
            if (this.categoriasFiltradas.length) {
                this.eventos = filtro1.filter(item => this.categoriasFiltradas.includes(item.category))
            } else {
                this.eventos = filtro1;
            }
        },
        filtroDobleUpcoming() {
            let filtro1 = this.arrayUpcoming.filter(evento => evento.name.toLowerCase().includes(this.buscador.toLowerCase()))
            if (this.categoriasFiltradas.length) {
                this.eventosUpcoming = filtro1.filter(item => this.categoriasFiltradas.includes(item.category))
            } else {
                this.eventosUpcoming = filtro1
            }
        },
        filtroDoblePast() {
            let filtro1 = this.arrayPast.filter(evento => evento.name.toLowerCase().includes(this.buscador.toLowerCase()))
            if (this.categoriasFiltradas.length) {
                this.eventosPast = filtro1.filter(item => this.categoriasFiltradas.includes(item.category))
            } else {
                this.eventosPast = filtro1
            }
        },
    },

}).mount('#app');
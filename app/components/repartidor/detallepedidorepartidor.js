import React, {Component} from 'react';

class DetallePedidoRepartidor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabecera: {},
            descripcion: [],

            precioaceptado: 0,
            preciorechazado: 0,

            productosaceptados: [],
            productosrechazados: [],
        };

        this.fetchListaProductos = this.fetchListaProductos.bind(this);

        this.sumarAceptado = this.sumarAceptado.bind(this);
        this.sumarRechazado = this.sumarRechazado.bind(this);
        this.aceptarTodo = this.aceptarTodo.bind(this);

    }

    fetchListaProductos(){
        fetch(
            '/api/pedido/' + this.props.idpedido + "?token="+localStorage.getItem('tiendauth')
        )
            .then(res => res.json())
            .then(pedidoDatos => {
                console.log(pedidoDatos);
                this.setState({
                    cabecera: pedidoDatos.data.cabecera,
                    descripcion: pedidoDatos.data.descripcion
                })
            });
    }

    aceptarTodo(){
        let sumatotal = 0;
        let productoaceptados = [];
        for (let i = 0; i < this.state.descripcion.length; i++){
            sumatotal += parseFloat(this.state.descripcion[i].preciototal);
            productoaceptados.push(parseInt(this.state.descripcion[i].iditem));
        }
        this.setState({
            precioaceptado: sumatotal.toFixed(2),
            productosaceptados: productoaceptados
        });
    }

    sumarAceptado(evt){
        let productosaceptados = this.state.productosaceptados;

        let [id, precio] = evt.target.name.split(':');
        id = parseInt(id);
        precio = parseFloat(precio);


        if (this.state.productosrechazados.indexOf(id) >= 0){ // SI YA ESTA EN PRODUCTOS RECHAZADOS
            let totalrechazado = parseFloat(this.state.preciorechazado);
            totalrechazado -= precio;
            const productosRechazados = this.state.productosrechazados;
            let nuevoProductosRechazados = [];
            for (let i = 0; i < productosRechazados.length; i++){ // ELIMINAMOS EL ID DE LA LISTA DE RECHAZADOS
                if (productosRechazados[i] !== id){
                    nuevoProductosRechazados.push(productosRechazados[i]);
                }
            }
            // ACTUALIZAMOS VALORES
            productosaceptados.push(id);

            this.setState({
                productosaceptados: productosaceptados,
                preciorechazado: totalrechazado,
                productosrechazados: nuevoProductosRechazados,
                precioaceptado: (parseFloat(this.state.precioaceptado) + precio).toFixed(2),
            });
        }else{ // SI NO ESTA EN PRODUCTOS RECHAZADO
            productosaceptados.push(id);

            this.setState({
                precioaceptado: (parseFloat(this.state.precioaceptado) + precio).toFixed(2),
                productosaceptados: productosaceptados
            });
        }
    }

    sumarRechazado(evt){
        let productosrechazados = this.state.productosrechazados;

        let [id, precio] = evt.target.name.split(':');
        id = parseInt(id);
        precio = parseFloat(precio);


        if (this.state.productosaceptados.indexOf(id) >= 0){
            let totalaceptado = parseFloat(this.state.precioaceptado);
            totalaceptado -= precio;
            const productosAceptados = this.state.productosaceptados;
            let nuevoProductosAceptados = [];
            for (let i = 0; i < productosAceptados; i++){
                if (productosAceptados[i] !== id){
                    nuevoProductosAceptados.push(productosAceptados[i]);
                }
            }

            productosrechazados.push(id);

            this.setState({
                precioaceptado: totalaceptado,
                productosaceptados: nuevoProductosAceptados,
                preciorechazado: (parseFloat(this.state.preciorechazado) + precio).toFixed(2),
                productosrechazados: productosrechazados
            });
        }else{
            productosrechazados.push(id);

            this.setState({
                preciorechazado: (parseFloat(this.state.preciorechazado) + precio).toFixed(2),
                productosrechazados: productosrechazados
            });
        }
    }

    componentDidMount() {
        this.fetchListaProductos();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <button className="btn btn-warning float-left" onClick={this.props.menuPrincipal}>
                        ATRAS
                    </button>
                    <div className="col-12 col-sm-10 col-md-8">
                        <h3 className="text-center">DATOS</h3>
                        <strong>MONTO TOTAL:</strong> S/ { parseFloat(this.state.cabecera.montototal).toFixed(2)}
                        <br/>
                        <strong>CALIFICACIÓN:</strong> { this.state.cabecera.calificacion? this.state.cabecera.calificacion + " estrellas": "Sin Calificar" }
                        <br/>
                        <strong>COMENTARIOS:</strong> { this.state.cabecera.comentarios? this.state.cabecera.comentarios: "Sin Comentarios" }
                    </div>
                    <div className="col-12 mt-3">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">DESCRIPCIÓN</th>
                                    <th scope="col">CANTIDAD</th>
                                    <th scope="col">PRECIO UNITARIO</th>
                                    <th scope="col">PRECIO TOTAL</th>
                                    <th scope="col">ESTADO</th>
                                    <th scope="col">
                                        MARCAR
                                        <button className="btn btn-success btn-sm ml-2" onClick={this.aceptarTodo}>MARCAR TODO</button>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.descripcion.map((obj, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <th scope="row">{ idx + 1 }</th>
                                                <td>{ obj.nombreitem }</td>
                                                <td>{ obj.cantidaditem }</td>
                                                <td>{ parseFloat(obj.preciounitario).toFixed(2) }</td>
                                                <td>{ parseFloat(obj.preciototal).toFixed(2) }</td>
                                                {
                                                    !obj.entregado  && (this.state.cabecera.estadopedido === "3" || this.state.cabecera.estadopedido === "2")?
                                                        <td className="bg-danger">RECHAZADO</td>:
                                                        obj.entregado?
                                                            <td className="bg-danger">ENTREGADO</td>
                                                            :
                                                            <td className="bg-warning">EN ESPERA</td>
                                                }
                                                <td>
                                                    <div className="row">
                                                        <button className="btn btn-success mt-1 ml-1" name={obj.iditem + ":" + obj.preciototal} onClick={this.sumarAceptado} disabled={this.state.productosaceptados.indexOf(obj.iditem) >= 0} >ENTREGADO</button>
                                                        <button className="btn btn-danger mt-1 ml-1" name={obj.iditem + ":" + obj.preciototal} onClick={this.sumarRechazado} disabled={this.state.productosrechazados.indexOf(obj.iditem) >= 0} >RECHAZADO</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6">
                        <h3>PRECIO DESCONTADO: S/ {this.state.preciorechazado}</h3>
                        <br/>
                        <h3>PRECIO FINAL: S/ {this.state.precioaceptado}</h3>
                        <hr/>
                        <button className="btn btn-success text-center float-left">
                            CONFIRMAR ENTREGA
                        </button>
                        <button className="btn-danger btn btn-sm text-center float-right">
                            ANULAR ENTREGA
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DetallePedidoRepartidor;
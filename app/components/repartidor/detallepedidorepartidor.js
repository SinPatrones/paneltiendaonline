import React, {Component} from 'react';
import swal from 'sweetalert';

class DetallePedidoRepartidor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabecera: {montototal: 0, montorechazado: 0, montopagado: 0},
            descripcion: [],

            precioaceptado: 0,
            preciorechazado: 0,

            productosaceptados: [],
            productosrechazados: [],
        };

        this.fetchAnularPedido = this.fetchAnularPedido.bind(this);
        this.fetchAceptarPedido = this.fetchAceptarPedido.bind(this);
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

    fetchAnularPedido(){
        swal( "Anular Pedido", {
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: false,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Anular",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            }
        })
            .then(rpta => {
                if (rpta){
                    fetch(
                        '/api/pedido/anular',{
                            method: 'put',
                            body: JSON.stringify({
                                idpedido: this.state.cabecera.idpedido
                            }),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'x-access-token': localStorage.getItem('tiendauth')
                            }
                        }
                    )
                        .then(res => res.json())
                        .then(data => {
                            console.log("Anulado:", data);
                        });
                }
            });
    }

    fetchAceptarPedido(){
        swal( "Aceptar Pedido", {
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: false,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            }
        })
            .then(rpta => {
                if (rpta){
                    fetch(
                        '/api/pedido/aceptar',{
                            method: 'put',
                            body: JSON.stringify({
                                idpedido: this.state.cabecera.idpedido,
                                aceptados: this.state.productosaceptados,
                                rechazados: this.state.productosrechazados,
                                precioaceptado: this.state.precioaceptado,
                                preciorechazado: this.state.preciorechazado
                            }),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'x-access-token': localStorage.getItem('tiendauth')
                            }
                        }
                    )
                        .then(res => res.json())
                        .then(data => {
                            if(data.status === 'ok'){
                                swal("REGISTRADO", "Se actualizo pedido, entregado", "success").then(r => console.log("RPTA:", r));
                            }else{
                                swal("ERROR", "No se pudo actualizar pedido, vuelva a intentarlo por favor", "error").then(r => console.log("RPTA:", r));
                            }
                        });
                }
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
            productosaceptados: productoaceptados,
            productosrechazados: [],
            preciorechazado: 0
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
            totalrechazado = totalrechazado.toFixed(2);
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


        if (this.state.productosaceptados.indexOf(id) >= 0){ // SI EL ITEM YA ESTA EN LA LISTA DE ELEMENTOS ACEPTADOS
            let totalaceptado = parseFloat(this.state.precioaceptado);
            totalaceptado -= precio;
            totalaceptado = totalaceptado.toFixed(2);
            const productosAceptados = this.state.productosaceptados;
            let nuevoProductosAceptados = [];
            for (let i = 0; i < productosAceptados.length; i++){
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
                        <h3 className="text-center">CLIENTE</h3>
                        <strong>NOMBRES: </strong> {this.state.cabecera.nombres} {this.state.cabecera.apellidos}
                        <br/>
                        <strong>DIRECCIÓN: </strong> {this.state.cabecera.direccion}
                        <br/>
                        <strong>TELEFONO: </strong> {this.state.cabecera.telefono}
                        <br/>
                        <h3 className="text-center">DATOS</h3>
                        <strong>MONTO TOTAL:</strong> S/ { parseFloat(this.state.cabecera.montototal).toFixed(2)}
                        <br/>
                        <strong>MONTO DELIVERY:</strong> {this.state.cabecera.montodelivery? "S/ " + parseFloat(this.state.cabecera.montodelivery).toFixed(2): "NO ASIGNADO"}
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
                                    {
                                        this.state.cabecera.estadopedido === '1' &&
                                        <th scope="col">
                                            MARCAR
                                            <button className="btn btn-success btn-sm ml-2" onClick={this.aceptarTodo}>MARCAR TODO</button>
                                        </th>
                                    }
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
                                                        <td style={{backgroundColor: "#ef5350"}}>RECHAZADO</td>:
                                                        obj.entregado?
                                                            <td style={{backgroundColor: "#93e9be"}}>ENTREGADO</td>
                                                            :
                                                            <td style={{backgroundColor: "#ace7ff"}}>EN ESPERA</td>
                                                }
                                                {
                                                    this.state.cabecera.estadopedido === '1' &&
                                                    <td>
                                                        <div className="row">
                                                            <button className="btn btn-success mt-1 ml-1" name={obj.iditem + ":" + obj.preciototal} onClick={this.sumarAceptado} disabled={this.state.productosaceptados.indexOf(obj.iditem) >= 0} >ENTREGADO</button>
                                                            <button className="btn btn-danger mt-1 ml-1" name={obj.iditem + ":" + obj.preciototal} onClick={this.sumarRechazado} disabled={this.state.productosrechazados.indexOf(obj.iditem) >= 0} >RECHAZADO</button>
                                                        </div>
                                                    </td>
                                                }
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
                        {
                            this.state.cabecera.estadopedido === '1' &&
                                <React.Fragment>
                                    <h3>MONTO RECHAZADO: S/ {parseFloat(this.state.preciorechazado).toFixed(2)}</h3>
                                    <br/>
                                    <h3>MONTO A PAGAR: S/ {parseFloat(this.state.precioaceptado).toFixed(2)}</h3>
                                    <br/>
                                    <h3>MONTO DELIVERY: {this.state.cabecera.montodelivery? "S/ " + parseFloat(this.state.cabecera.montodelivery).toFixed(2): "NO ASIGNADO"}</h3>
                                    <br/>
                                    <h3>TOTAL: {this.state.cabecera.montodelivery? "S/ " + (parseFloat(this.state.cabecera.montodelivery) + parseFloat(this.state.precioaceptado)).toFixed(2): this.state.precioaceptado.toFixed(2) + " SIN MONTO DE ENVIO"}</h3>
                                </React.Fragment>
                        }
                        {
                            this.state.cabecera.estadopedido !== '1' &&
                            <React.Fragment>
                                <h3>MONTO RECHAZADO FUE: S/ {parseFloat(this.state.cabecera.montorechazado).toFixed(2)}</h3>
                                <br/>
                                <h3>MONTO PAGADO FUE: S/ {(parseFloat(this.state.cabecera.montopagado) + parseFloat(this.state.cabecera.montodelivery)).toFixed(2)}</h3>
                            </React.Fragment>
                        }

                        <hr/>
                        {
                            this.state.cabecera.estadopedido === '1' &&
                            <button className="btn btn-success text-center float-left" disabled={(this.state.productosaceptados.length + this.state.productosrechazados.length) !== this.state.descripcion.length}
                                    onClick={this.fetchAceptarPedido}
                            >
                                CONFIRMAR ENTREGA
                            </button>
                        }
                        {
                            this.state.cabecera.estadopedido === '1' &&
                            <button className="btn-danger btn btn-sm text-center float-right" onClick={this.fetchAnularPedido}>
                                ANULAR ENTREGA
                            </button>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DetallePedidoRepartidor;
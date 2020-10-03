import React, {Component} from 'react';
import DetallePedidoRepartidor from "./detallepedidorepartidor";
import swal from 'sweetalert';

class VerPedidosRepartidor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaPedidos: [],
            listaRepartidores: [],
            menu: 1,
            idpedido: null,
            idrepartidor: 0,

            todo: 'no',
        };

        this.fetchObtenerPedidos = this.fetchObtenerPedidos.bind(this);
        this.fetchObtenerTodosPedidos = this.fetchObtenerTodosPedidos.bind(this);

        this.verPedido = this.verPedido.bind(this);
        this.menuPrincipal = this.menuPrincipal.bind(this);
    }

    fetchObtenerPedidos(){
        console.log('/api/pedido/repartidor');
        this.setState({
            todo: 'no'
        }, () => {
            fetch(
                '/api/pedido/repartidor/pedidos?todo=' + this.state.todo,{
                    method: 'get',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('tiendauth')
                    }
                }
            )
                .then(res => res.json())
                .then(listaPedidos => {
                    console.log("OBTENER PEDIDOS DEL REPARTIDOR", listaPedidos);
                    this.setState({
                        listaPedidos: listaPedidos.data
                    });
                });
        });
    }

    fetchObtenerTodosPedidos(){
        this.setState({
            todo: 'si'
        }, () => {
            fetch(
                '/api/pedido/repartidor/pedidos?todo=' + this.state.todo,{
                    method: 'get',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('tiendauth')
                    }
                }
            )
                .then(res => res.json())
                .then(listaPedidos => {
                    console.log("OBTENER PEDIDOS DEL REPARTIDOR", listaPedidos);
                    this.setState({
                        listaPedidos: listaPedidos.data
                    });
                });
        });
    }

    verPedido(evt){
        const nombre = evt.target.name.split(':');
        console.log("VIENDO PEDIDO:", nombre);
        this.setState({
            idpedido: nombre[0]
        }, () => {
            this.setState({
                menu: 2
            })
        });
    }

    menuPrincipal(){
        this.setState({
            menu: 1
        });
    }

    componentDidMount() {
        this.fetchObtenerPedidos();
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.menu === 1 &&
                    <div className="row justify-content-center">
                        <h3 className="text-center">VER MIS PEDIDOS POR ENTREGAR</h3>
                        <button className="btn btn-warning float-right fa fa-eye ml-5" onClick={this.fetchObtenerTodosPedidos} hidden={this.state.todo === 'si'}> TODO</button>
                        <button className="btn btn-warning float-right fa fa-eye ml-5" onClick={this.fetchObtenerPedidos} hidden={this.state.todo === 'no'}> POR ENTREGAR</button>
                        <div className="col-12 mt-3">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col" className="text-center">#</th>
                                        <th scope="col">FECHA - HORA</th>
                                        <th scope="col">MONTO PEDIDO</th>
                                        <th scope="col">CLIENTE</th>
                                        <th scope="col">TELEFONO</th>
                                        <th scope="col">DIRECCIÓN</th>
                                        <th scope="col">MET. PAGO</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.listaPedidos.map((obj, idx) => {
                                            return (
                                                <tr key={obj.idpedido}>
                                                    <th scope="row" className="text-center" style={{backgroundColor: obj.estadopedido === '3'? "#ef5350": obj.estadopedido === '2'? "#93e9be": "#ace7ff"}}><strong>{ obj.idpedido }</strong></th>
                                                    <td>{ "Fecha: " + formatoFecha(obj.tsfechapedido)  } <br/> { "Hora: " + formatoHora(obj.tsfechapedido) }</td>
                                                    <td>S/ { parseFloat(obj.montototal).toFixed(2) } <strong>( {obj.montodelivery? "Precio Envio S/ " + obj.montodelivery.toFixed(2): "SIN MONTO"} )</strong></td>
                                                    <td>{ obj.nombres + " " + obj.apellidos }</td>
                                                    <td>{ obj.telefono }</td>
                                                    <td>{ obj.direccion }</td>
                                                    <td>{ obj.tipodepago.toUpperCase() }</td>
                                                    <td>
                                                        <button className="btn btn-success" name={obj.idpedido + ":pedido"} onClick={this.verPedido}>VER</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="modal fade" id="listaRepartidores" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="listaRepartidoresLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="listaRepartidoresLabel">Seleccione Repartidor</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body text-center">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">NOMBRES</th>
                                                    <th scope="col">APELLIDOS</th>
                                                    <th scope="col"></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.listaRepartidores.map((obj, idx) => {
                                                        return (
                                                            <tr className={this.state.idrepartidor.toString() === obj.idadministrador.toString()? "bg-success": ""}>
                                                                <th scope="row">{ obj.idadministrador}</th>
                                                                <td>{ obj.nombres }</td>
                                                                <td>{ obj.apellidos }</td>
                                                                <td>
                                                                    <button className="btn btn-success" name={obj.idadministrador + ":repartidor"} onClick={this.seleccionarRepartidor}>SELECCIONAR</button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.cancelarRepartidor}>Cerrar</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.fetchAsignarRepartidor} disabled={this.state.idrepartidor === 0}>Guardar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    this.state.menu === 2 &&
                        <DetallePedidoRepartidor
                            idpedido={this.state.idpedido}
                            menuPrincipal={this.menuPrincipal}
                            fetchObtenerPedidos={this.fetchObtenerPedidos}
                        />
                }
            </React.Fragment>
        );
    }
}

const formatoFecha = (fechanueva) => {
    const formateado = new Date(fechanueva);
    let anio = formateado.getFullYear();
    let mes = formateado.getMonth() + 1;
    mes = mes < 10? "0" + mes.toString():mes.toString();
    let dia = formateado.getDate() < 10? '0' + formateado.getDate(): formateado.getDate();

    return dia + "/" + mes + "/" + anio;
};

const formatoHora = (horanueva) => {
    const formato = new Date(horanueva);
    return formato.getHours() + ":" + formato.getMinutes() + ":" + formato.getSeconds();
};

export default VerPedidosRepartidor;

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
        };

        this.fetchObtenerPedidos = this.fetchObtenerPedidos.bind(this);

        this.verPedido = this.verPedido.bind(this);
        this.menuPrincipal = this.menuPrincipal.bind(this);
    }

    fetchObtenerPedidos(){
        console.log('/api/pedido/repartidor');
        fetch(
            '/api/pedido/repartidor/pedidos',{
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
    }

    verPedido(evt){
        const nombre = evt.target.name.split(':');
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
                        <h3 className="text-center">VER MIS PEDIDOS</h3>
                        <div className="col-12">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">FECHA - HORA</th>
                                    <th scope="col">MONTO PEDIDO</th>
                                    <th scope="col" className="text-center">ESTADO PEDIDO</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.listaPedidos.map((obj, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <th scope="row">{ obj.idpedido }</th>
                                                <td>{ formatoFecha(obj.tsfechapedido) + " - " + formatoHora(obj.tsfechapedido) }</td>
                                                <td>{ parseFloat(obj.montototal).toFixed(2) }</td>
                                                <td align="center" className={ obj.estadopedido === '3'? "bg-danger": obj.estadopedido === '2'? "bg-success": obj.estadopedido === '1'? "bg-warning":"bg-dark" }>{ obj.estadopedido === '3'? "ANULADO": obj.estadopedido === '2'? "ENTREGADO": obj.estadopedido === '1'? "EN ESPERA":"DESCONOCIDO" }</td>
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

                        <div class="modal fade" id="listaRepartidores" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="listaRepartidoresLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="listaRepartidoresLabel">Seleccione Repartidor</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body text-center">
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
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal" oncancel={this.cancelarRepartidor}>Cerrar</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.fetchAsignarRepartidor} disabled={this.state.idrepartidor === 0}>Guardar</button>
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
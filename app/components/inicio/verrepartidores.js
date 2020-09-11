import React, {Component} from 'react';
import swal from 'sweetalert';

class VerRepartidores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listapersonal: [],

            nombre: '',
            idadministrador: '',

            clave: '',
        };

        this.fetchListaPersonal = this.fetchListaPersonal.bind(this);
        this.fetchCambiarEstado = this.fetchCambiarEstado.bind(this);
        this.fetchCambiarClave = this.fetchCambiarClave.bind(this);

        this.cambiarClave = this.cambiarClave.bind(this);
    }

    fetchListaPersonal() {
        fetch(
            '/api/administrador'
        )
            .then(res => res.json())
            .then(lista => {
                if (lista.status === 'ok') {
                    this.setState({
                        listapersonal: lista.data
                    })
                } else {
                    swal("REGISTRADO", lista.msg, "error");
                }
            });
    }

    fetchCambiarEstado(idadministrador, estado){
        swal( "Cambiando Estado", {
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: false,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Continuar",
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
                        '/api/administrador/estado',{
                            method: 'put',
                            body: JSON.stringify({
                                idadministrador, estado
                            }),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === 'ok'){
                                swal("ESTADO ACTUALIZADO", "Se le actualizo el estado al usuario", "success");
                                this.fetchListaPersonal();
                            }else{
                                swal("¡¡ UPS !!", "No se pudo actualizar el estado del usuario", "error");
                            }
                        });
                }
            });
    }

    fetchCambiarClave(){
        swal( "¿Confirma de que desea cambiar la clave del usuario?", {
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: false,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Continuar",
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
                        '/api/administrador/cambiarclave',{
                            method: 'put',
                            body: JSON.stringify({
                                idadministrador: this.state.idadministrador,
                                clave: this.state.clave
                            }),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'x-access-token': localStorage.getItem('tiendauth')
                            }
                        }
                    )
                        .then(res => res.json())
                        .then(cambio => {
                            if(cambio.status === 'ok'){
                                swal("ESTADO ACTUALIZADO", "Se le actualizo el estado al usuario", "success");
                            }else{
                                swal(cambio.idstatus === 202? "NO ESTA AUTORIZADO": "ERROR EN SISTEMA", "No se pudo aplicar cambio de clave", "error");
                            }
                        });
                }
            });
    }

    cambiarClave(idadministrador, nombre){
        console.log("Cambiando de ", idadministrador, nombre);
        this.setState({
            idadministrador,
            nombre
        });
    }

    componentDidMount() {
        this.fetchListaPersonal();
    }

    render() {
        return (
            <div className="row justify-content-center">
                <h3 className="text-center">VER REPARTIDORES</h3>
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">NOMBRES</th>
                                <th scope="col">APELLIDOS</th>
                                <th scope="col">CORREO</th>
                                <th scope="col">TIPO</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.listapersonal.map((obj, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <th scope="row">{obj.idadministrador}</th>
                                            <td>{obj.nombres}</td>
                                            <td>{obj.apellidos}</td>
                                            <td>{obj.correo}</td>
                                            <td>{obj.role? "Administrador":"Repartidor"}</td>
                                            <td align="center">
                                                {
                                                    obj.habilitado?
                                                    <button className="btn btn-danger" onClick={this.fetchCambiarEstado.bind(this, obj.idadministrador,!obj.habilitado)}>DESHABILITAR</button>
                                                    :
                                                    <button className="btn btn-success" onClick={this.fetchCambiarEstado.bind(this, obj.idadministrador,!obj.habilitado)}>HABILITAR</button>
                                                }
                                                <button className="btn btn-warning ml-2" data-toggle="modal" data-target="#exampleModal" onClick={this.cambiarClave.bind(this,obj.idadministrador,obj.nombres + " " + obj.apellidos)}>CAMBIAR CLAVE</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }

                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Cambiando Clave de {this.state.nombre}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="clave">CLAVE</label>
                                    <input type="text" id="clave" name="clave" value={this.state.clave} onChange={(evt) => {this.setState({[evt.target.name]: evt.target.value})}} className="form-control"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-warning" data-dismiss="modal">Cancelar</button>
                                <button className="btn btn-danger" onClick={this.fetchCambiarClave}>Cambiar</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default VerRepartidores;
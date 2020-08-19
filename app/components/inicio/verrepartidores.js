import React, {Component} from 'react';
import swal from 'sweetalert';

class VerRepartidores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listapersonal: []
        };

        this.fetchListaPersonal = this.fetchListaPersonal.bind(this);
        this.fetchCambiarEstado = this.fetchCambiarEstado.bind(this);
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
                            swal("ESTADO ACTUALIZADO", "Se le actualizo el estado al usuario", "success");
                            console.log("RPTA:", data);
                        });
                }
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
                                                obj.habilitado? <button className="btn btn-danger" onClick={this.fetchCambiarEstado.bind(this, obj.idadministrador,!obj.habilitado)}>DESHABILITAR</button>:<button className="btn btn-success" onClick={this.fetchCambiarEstado.bind(this, obj.idadministrador,!obj.habilitado)}>HABILITAR</button>
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default VerRepartidores;
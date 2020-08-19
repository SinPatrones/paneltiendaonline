import React, {Component} from 'react';
import swal from 'sweetalert';

class RegistrarRepartidor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombres: '',
            apellidos: '',
            correo: '',
            clave: '',
            role: 0,
        };

        this.inputChangeComponent = this.inputChangeComponent.bind(this);
        this.borrarTodo = this.borrarTodo.bind(this);

        this.fetchCrearAdministrador = this.fetchCrearAdministrador.bind(this);
    }

    inputChangeComponent(evt){
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    borrarTodo(){
        this.setState({
            nombres: '',
            apellidos: '',
            correo: '',
            clave: '',
            role: 0,
        });
    }

    fetchCrearAdministrador(evt){
        evt.preventDefault();
        console.log("Creando administrador");
        if (this.state.nombres !== '' && this.state.apellidos !== '' && this.state.correo !== '' && this.state.clave !== ''){
            let body = {
                nombres: this.state.nombres,
                apellidos: this.state.apellidos,
                correo: this.state.correo,
                clave: this.state.clave,
                role: this.state.role
            };
            fetch(
                "/api/administrador",{
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('tiendauth')
                    }
                }
            )
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.status === "ok"){
                        swal("REGISTRADO", "Se registro nuevo personal", "success").then(r => console.log("RPTA:", r));
                        this.borrarTodo();
                    }else{
                        swal("ERROR REGISTRAR", "Error al registrar", "error").then(r => console.log("RPTA:", r));
                    }
                });
        }else{
            swal("REGISTRADO", "Faltan completar datos para registrar", "error").then(r => console.log("RPTA:", r));
        }
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-md-6">
                    <h3 className="text-center">REGISTRAR PERSONAL</h3>
                    <form onSubmit={this.fetchCrearAdministrador}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nombres">Nombres</label>
                                <input type="text" className="form-control" id="nombres" name="nombres" value={this.state.nombres} onChange={this.inputChangeComponent}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="apellidos">Apellidos</label>
                                <input type="text" className="form-control" id="apellidos" name="apellidos" value={this.state.apellidos} onChange={this.inputChangeComponent}/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="correo">Correo</label>
                                <input type="email" className="form-control" id="correo" name="correo" value={this.state.correo} onChange={this.inputChangeComponent}/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="clave">Clave</label>
                                <input type="password" className="form-control" id="clave" name="clave" value={this.state.clave} onChange={this.inputChangeComponent}/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="role">Tipo Usuario</label>
                                <select className="form-control" name="role" id="role" value={this.state.role} onChange={this.inputChangeComponent}>
                                    <option value="0">Repartidor</option>
                                    <option value="1">Administrador</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row justify-content-center">
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary">REGISTRAR</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default RegistrarRepartidor;
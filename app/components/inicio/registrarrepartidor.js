import React, {Component} from 'react';

class RegistrarRepartidor extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-md-6">
                    <h3 className="text-center">REGISTRAR REPARTIDOR</h3>
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nombreitem">Nombres</label>
                                <input type="text" className="form-control" id="nombreitem" name="nombreitem"/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="apellidos">Apellidos</label>
                                <input type="text" className="form-control" id="apellidos" name="apellidos"/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="correo">Correo</label>
                                <input type="email" className="form-control" id="correo" name="correo"/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="clave">Clave</label>
                                <input type="password" className="form-control" id="clave" name="clave"/>
                            </div>
                        </div>

                        <div className="form-row justify-content-center">
                            <div className="col-4">
                                <button type="button" className="btn btn-primary">REGISTRAR</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default RegistrarRepartidor;
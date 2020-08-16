import React, {Component} from 'react';

class VerRepartidores extends Component {
    render() {
        return (
            <div className="row justify-content-center">
                <h3 className="text-center">VER REPARTIDORES</h3>
                <div className="col-12">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombres</th>
                            <th scope="col">Apellidos</th>
                            <th scope="col">Correo</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>nombres</td>
                            <td>apellidos</td>
                            <td>@correo@correo.com</td>
                            <td>
                                <button className="btn btn-danger">DESHABILITAR</button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>nombres</td>
                            <td>apellidos</td>
                            <td>@correo@correo.com</td>
                            <td>
                                <button className="btn btn-danger">DESHABILITAR</button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>nombres</td>
                            <td>apellidos</td>
                            <td>@correo@correo.com</td>
                            <td>
                                <button className="btn btn-danger">DESHABILITAR</button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>nombres</td>
                            <td>apellidos</td>
                            <td>@correo@correo.com</td>
                            <td>
                                <button className="btn btn-danger">DESHABILITAR</button>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default VerRepartidores;
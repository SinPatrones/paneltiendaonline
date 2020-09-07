import React, {Component} from 'react';
import Cookie from "js-cookie";
import swal from 'sweetalert';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.cerrarSesion = this.cerrarSesion.bind(this);
    }

    cerrarSesion(){
        console.log("Cerrando sesión");
        localStorage.setItem('tiendauth', "");
        Cookie.set('tiendaauth', "");
        swal("SESIÓN CERRADA", "Lo esperamos de nuevamente.", "success");
        location.href = '/admin/ingresar';
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/panel"><img src="/images/logo.png" width="80px"/> </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    {
                        this.props.nivelusuario === 1 &&
                        <ul className="navbar-nav">
                            <li className="nav-item menutop">
                                <a className="nav-link" href="#" onClick={this.props.elegirOpcion} name="1:ingresarproducto">Ingresar Producto</a>
                            </li>
                            <li className="nav-item menutop">
                                <a className="nav-link" href="#" onClick={this.props.elegirOpcion} name="2:verproducto">Ver Productos</a>
                            </li>
                            <li className="nav-item menutop">
                                <a className="nav-link" href="#" onClick={this.props.elegirOpcion} name="3:registrarrepartidor">Registrar Personal</a>
                            </li>
                            <li className="nav-item menutop">
                                <a className="nav-link" href="#" onClick={this.props.elegirOpcion} name="4:verrepartidores">Ver Personal</a>
                            </li>
                            <li className="nav-item menutop">
                                <a className="nav-link" href="#" onClick={this.props.elegirOpcion} name="5:verpedidos">Ver Pedidos</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Configuración
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#" onClick={this.cerrarSesion}>Salir</a>
                                </div>
                            </li>
                        </ul>
                    }

                    {
                        this.props.nivelusuario === 0 &&
                        <ul className="navbar-nav">
                            <li className="nav-item menutop">
                                <a className="nav-link" href="#" onClick={this.props.elegirOpcion} name="101:mispedidos">Mis Pedidos</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Configuración
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#" onClick={this.cerrarSesion}>Salir</a>
                                </div>
                            </li>
                        </ul>
                    }

                </div>

                <button type="button" className="btn btn-warning" onClick={this.cerrarSesion}>Salir</button>

            </nav>
        );
    }
}

export default Navbar;
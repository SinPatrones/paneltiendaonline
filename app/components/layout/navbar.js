import React, {Component} from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/panel"><img src="/images/logo.png" width="80px"/> </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item menutop">
                            <a className="nav-link" href="#">Ingresar Producto</a>
                        </li>
                        <li className="nav-item menutop">
                            <a className="nav-link" href="#">Ver Productos</a>
                        </li>
                        <li className="nav-item menutop">
                            <a className="nav-link" href="#">Registrar Personal</a>
                        </li>
                        <li className="nav-item menutop">
                            <a className="nav-link" href="#">Ver Personal</a>
                        </li>
                        <li className="nav-item menutop">
                            <a className="nav-link" href="#">Ver Pedidos</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Configuración
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" href="#">Salir</a>
                            </div>
                        </li>
                    </ul>
                </div>

                <button type="button" className="btn btn-warning">Salir</button>

            </nav>
        );
    }
}

export default Navbar;
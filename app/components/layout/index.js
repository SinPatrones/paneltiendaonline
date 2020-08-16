import React, {Component} from 'react';
import Navbar from "./navbar";
import Sidebar from "./sidebar";

class Index extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <React.Fragment>
                <Navbar/>

                <Sidebar contenido={this.props.children} elegirOpcion={this.props.elegirOpcionG}/>

            </React.Fragment>
        );
    }
}

export default Index;
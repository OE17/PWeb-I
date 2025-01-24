import './Contador.css'
import React, { Component } from "react";

class Contador extends Component {

    state = {
        numero: this.props.numeroInicial || 0,
        passo: this.props.passoInicial || 1,
    };

    inc = () => {
        this.setState({
            numero: this.state.numero + this.state.passo
        });
    }

    dec = () => {
        this.setState({
            numero: this.state.numero - this.state.passo
        });
    }

    setPasso = (e) => {
        this.setState({
            passo: +e.target.value,
        });
    }

    /*
    inc() {
        this.setState({
            numero: this.state.numero + 1
        });
    }
*/
    
/*
    state = {
        numero: 0
    }
   
  constructor(props){
    super(props)

    this.state = {
        numero: props.numeroInicial
    }

  }

  constructor(props){
    super(props)

    this.inc = this.inc.bind(this)

  }
    */
    render(){
        return (
            <div className="Contador">
                <h2>Contador</h2>
                <h3>Valor Inicial: { this.state.numero } </h3>
                <div>
                    <label htmlFor="passoInput">Passo: </label>
                    <input id="passoInput" type="number"
                     value={this.state.passo} onChange={this.setPasso} />
                </div>
                <button onClick={this.inc}>+</button>
                <button onClick={this.dec}>-</button>
                
            </div>
        )
    }

}
//<button onClick={e => this.inc() }>+</button>
export default Contador
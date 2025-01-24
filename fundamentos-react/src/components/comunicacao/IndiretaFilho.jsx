import React, { cloneElement } from "react";

export default props => {
    const cb = props.quandoClicar
    const gerarIdade = () => parseInt(Math.random() * (20)) + 50
    return (
        <div>
            <div>Filho</div>
            <button onClick={ function (e) {
                props.quandoClicar('João',gerarIdade(),true)
            }
            }>Fornecer Informações</button>
        </div>
    )
}
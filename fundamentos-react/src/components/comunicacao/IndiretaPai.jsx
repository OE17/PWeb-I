import React, {useState} from "react";
import IndiretaFilho from "./IndiretaFilho";

export default props => {
    //const [a, b] = [1, 2]
    //let nome = useState('?')
    const [nome, setNome] = useState('?')
    const [idade, setIdade] = useState(0)
    const [teste, setTeste] = useState(false)
    //let nome = '?'
    //let idade = 0
    //let teste = false
    function fornecerInformacoes(nomeParam,idadeParam,testeParam){
        setNome(nomeParam)
        setIdade(idadeParam)
        setTeste(testeParam)
        //nome = nomeParam
        //idade = idadeParam
        //teste = testeParam
        //console.log(nome,idade,teste)
    }

    return (
        <div>
            <div>
                <span>{nome} </span>
                <span><strong>{idade}</strong></span>
                <span> {teste ? 'Verdadeiro' : 'Falso'}</span>
            </div>
            <IndiretaFilho quandoClicar={ fornecerInformacoes }></IndiretaFilho>
        </div>
    )
}
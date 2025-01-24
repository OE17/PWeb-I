import './App.css';

import * as React from "react";

import Card from "./components/layout/Card";
import Aleatorio from "./components/basicos/Aleatorio";
import Primeiro from './components/basicos/Primeiro';
import ComParametro from './components/basicos/ComParametro';
import Fragmento from './components/basicos/Fragmento';
import Familia from './components/basicos/Familia';
import MembroFamilia from './components/basicos/MembroFamilia';
import ListaAlunos from './components/repeticao/ListaAlunos';
import ParOuImpar from './components/condicional/ParOuImpar';
import UsuarioInfo from './components/condicional/UsuarioInfo';
import TabelaProdutos from './components/repeticao/TabelaProdutos'
import IndiretaPai from './components/comunicacao/IndiretaPai';
import Input from './components/formulario/Input';
import Contador from './components/contador/Contador';
import Contador2 from './components/contador2/Contador2';
import Mega from './components/mega/Mega';

export default () => (

    <div className="App">
        <h1>Aula 1</h1>

        <div className="exercicios">

        <Card titulo="#13 - Números Mega" color="#B9006E">
            <Mega qtd={7}></Mega>
        </Card>

        <Card titulo="#12 - Contador v2.0" color="#424242">
            <Contador2 numeroInicial={10}></Contador2>
        </Card>

        <Card titulo="#11 - Contador" color="#424242">
            <Contador numeroInicial={10}></Contador>
        </Card>

        <Card titulo="#10 - Componente Controlado (Input)" color="#E45F56">
            <Input></Input>
        </Card>

        <Card titulo="#09 - Indireta" color="#3A9AD9">
            <IndiretaPai></IndiretaPai>
        </Card>

        <Card titulo="#08 - Desafio Repetição" color="#3A9AD9">
            <TabelaProdutos></TabelaProdutos>
        </Card>

        <Card titulo="#07 - Rendereização Condicional" color="#982395">
            <ParOuImpar numero={15}></ParOuImpar>
            {/* <UsuarioInfo usuario={{nome: 'Mauricio'}} /> */}
            <UsuarioInfo usuario={{nome1: 'm@email.com'}} />
        </Card>

        <Card titulo="#06 - Repetição" color="#FF4C65">
            <ListaAlunos></ListaAlunos>
        </Card>

        <Card titulo="#05 - Componente com Filhos" color="#00C8F8">
            <Familia sobrenome="Ferreira">
                <MembroFamilia nome="Pedro" />
                <MembroFamilia nome="Ana" />
                <MembroFamilia nome="Gustavo" />
            </Familia>
        </Card>

        <Card titulo="#04 - Primeiro" color="#588C73">
            <Primeiro />
        </Card>

        <Card titulo="#03 - Com Parâmetro" color="#E8B71A">
            <ComParametro
                titulo="Segundo Componente"
                subtitulo="conteudo subtitulo"
                aluno="Jose" nota={9.3}
            />
        </Card>

        <Card titulo="#02 - Fragmento" color="#E94C6F">
            <Fragmento />
        </Card>

        <Card titulo="#01 - Número Aleatório" color="#080">
            <Aleatorio min={1} max={60} />
        </Card>

        </div>
    </div>
);
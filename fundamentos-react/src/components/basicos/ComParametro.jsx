export default function (props){
    //console.log(props)
    const sub = props.subtitulo
    const status = props.nota >=7 ? 'Aprovado' : 'Recuperação'
    return (
        <div>
            <h2>{ props.titulo }</h2>
            <h3>{ sub }</h3>
            <p>{ props.aluno } tem nota { props.nota } e foi { status }
            </p>
        </div>
    )
}
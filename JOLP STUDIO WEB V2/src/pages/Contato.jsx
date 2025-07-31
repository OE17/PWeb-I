import './Contato.css';

function Contato() {
  return (
    <div className="contato">
      <div className="contato-container">
        <div className="contato-content">
          <h2 className="titulo">Você pode falar conosco pelo nosso email:</h2>
          
          <div className="email-box">
            <p className="email">jolpstudio@example.com</p>
          </div>

          <div className="mensagem-adicional">
            <p>
              Envie sugestões! Estamos mais do que dispostos a ouvir ideias, 
              e se sinta à vontade para reportar bugs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato; 
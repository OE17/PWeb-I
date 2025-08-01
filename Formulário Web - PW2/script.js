// Função para formatar o CEP
function formatarCep(cep) {
    // Remove tudo que não é número
    cep = cep.replace(/\D/g, '');
    
    // Aplica a máscara 00000-000
    if (cep.length <= 5) {
        return cep;
    } else {
        return cep.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
}

// Função para limpar CEP (remover formatação)
function limparCep(cep) {
    return cep.replace(/\D/g, '');
}

// Função para validar CEP
function validarCep(cep) {
    const cepLimpo = limparCep(cep);
    return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
}

// Função para buscar endereço via ViaCEP
async function buscarEndereco(cep) {
    const cepLimpo = limparCep(cep);
    const statusCep = document.getElementById('statusCep');
    const enderecoInput = document.getElementById('endereco');
    const btnBuscar = document.getElementById('btnBuscarCep');
    
    // Validar CEP antes de buscar
    if (!validarCep(cep)) {
        statusCep.textContent = 'CEP inválido. Use o formato 00000-000';
        statusCep.className = 'status-cep erro';
        enderecoInput.value = '';
        return;
    }
    
    // Mostrar loading
    statusCep.textContent = 'Buscando endereço...';
    statusCep.className = 'status-cep carregando';
    btnBuscar.disabled = true;
    enderecoInput.value = '';
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            statusCep.textContent = 'CEP não encontrado';
            statusCep.className = 'status-cep erro';
            enderecoInput.value = '';
        } else {
            // Montar endereço completo
            const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            enderecoInput.value = endereco;
            statusCep.textContent = 'CEP válido - Endereço encontrado';
            statusCep.className = 'status-cep sucesso';
        }
    } catch (error) {
        statusCep.textContent = 'Erro ao buscar CEP. Tente novamente';
        statusCep.className = 'status-cep erro';
        enderecoInput.value = '';
        console.error('Erro ao buscar CEP:', error);
    } finally {
        btnBuscar.disabled = false;
    }
}

// Função para validar campo individual
function validarCampo(campo) {
    const valor = campo.value.trim();
    const campoContainer = campo.parentElement;
    
    // Remove classes de erro anteriores
    campoContainer.classList.remove('campo-erro');
    const erroAnterior = campoContainer.querySelector('.erro-validacao');
    if (erroAnterior) {
        erroAnterior.remove();
    }
    
    // Validação
    if (valor.length === 0) {
        mostrarErroCampo(campoContainer, 'Este campo é obrigatório');
        return false;
    }
    
    if (valor.length < 3) {
        mostrarErroCampo(campoContainer, 'Este campo deve ter pelo menos 3 caracteres');
        return false;
    }
    
    // Validação específica para CEP
    if (campo.id === 'cep' && !validarCep(valor)) {
        mostrarErroCampo(campoContainer, 'CEP deve ter 8 dígitos');
        return false;
    }
    
    return true;
}

// Função para mostrar erro em campo específico
function mostrarErroCampo(container, mensagem) {
    container.classList.add('campo-erro');
    
    const spanErro = document.createElement('span');
    spanErro.className = 'erro-validacao';
    spanErro.textContent = mensagem;
    container.appendChild(spanErro);
}

// Função para verificar campos vazios
function verificarCamposVazios() {
    const campos = ['matricula', 'nome', 'cep', 'endereco'];
    let camposVazios = [];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        const valor = campo.value.trim();
        
        if (valor.length === 0) {
            const label = campo.previousElementSibling.textContent;
            camposVazios.push(label);
        }
    });
    
    return camposVazios;
}

// Função para validar todos os campos
function validarFormulario() {
    const campos = ['matricula', 'nome', 'cep', 'endereco'];
    let todosValidos = true;
    let camposInvalidos = [];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (!validarCampo(campo)) {
            todosValidos = false;
            camposInvalidos.push(campo.previousElementSibling.textContent);
        }
    });
    
    return { valido: todosValidos, camposInvalidos };
}

// Função para mostrar mensagem de sucesso e opção de nova resposta
function mostrarMensagemSucesso() {
    const resposta = confirm('✅ Sua resposta foi enviada com sucesso!\n\nDeseja responder novamente?');
    
    if (resposta) {
        limparFormulario();
    }
}

// Função para limpar o formulário
function limparFormulario() {
    // Limpar todos os campos
    document.getElementById('formulario').reset();
    
    // Limpar status do CEP
    document.getElementById('statusCep').textContent = '';
    document.getElementById('statusCep').className = 'status-cep';
    
    // Limpar campo endereço
    document.getElementById('endereco').value = '';
    
    // Remover classes de erro
    const camposComErro = document.querySelectorAll('.campo-erro');
    camposComErro.forEach(campo => {
        campo.classList.remove('campo-erro');
    });
    
    // Remover mensagens de erro
    const erros = document.querySelectorAll('.erro-validacao');
    erros.forEach(erro => {
        erro.remove();
    });
    
    // Focar no primeiro campo
    document.getElementById('matricula').focus();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const btnBuscarCep = document.getElementById('btnBuscarCep');
    const formulario = document.getElementById('formulario');
    
    // Formatação automática do CEP
    cepInput.addEventListener('input', function(e) {
        e.target.value = formatarCep(e.target.value);
    });
    
    // Buscar CEP quando clicar na lupa
    btnBuscarCep.addEventListener('click', function() {
        const cep = cepInput.value;
        if (cep) {
            buscarEndereco(cep);
        } else {
            document.getElementById('statusCep').textContent = 'Digite um CEP para buscar';
            document.getElementById('statusCep').className = 'status-cep erro';
        }
    });
    
    // Buscar CEP quando pressionar Enter no campo CEP
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnBuscarCep.click();
        }
    });
    
    // Validação do formulário ao submeter
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Primeiro verificar se há campos vazios
        const camposVazios = verificarCamposVazios();
        
        if (camposVazios.length > 0) {
            // Há campos vazios - não permitir envio
            const container = document.querySelector('.container');
            container.classList.add('shake');
            
            setTimeout(() => {
                container.classList.remove('shake');
            }, 500);
            
            alert(`❌ Não é possível processar o formulário!\n\nOs seguintes campos são obrigatórios e estão vazios:\n• ${camposVazios.join('\n• ')}\n\nPor favor, preencha todos os campos obrigatórios para continuar.`);
            return;
        }
        
        // Se não há campos vazios, fazer validação completa
        const resultado = validarFormulario();
        
        if (resultado.valido) {
            // Todos os campos válidos - mostrar mensagem de sucesso
            mostrarMensagemSucesso();
        } else {
            // Há campos inválidos
            const container = document.querySelector('.container');
            container.classList.add('shake');
            
            setTimeout(() => {
                container.classList.remove('shake');
            }, 500);
            
            alert(`❌ Por favor, corrija os seguintes campos:\n• ${resultado.camposInvalidos.join('\n• ')}\n\nVerifique se todos os campos atendem aos critérios de validação.`);
        }
    });
    
    // Limpar erros quando o usuário começar a digitar
    const todosInputs = document.querySelectorAll('input[type="text"]');
    todosInputs.forEach(input => {
        input.addEventListener('input', function() {
            const container = this.parentElement;
            container.classList.remove('campo-erro');
            const erro = container.querySelector('.erro-validacao');
            if (erro) {
                erro.remove();
            }
        });
    });
});
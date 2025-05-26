// Funções de manipulação de formulários
function toggleForm(form) {
    document.getElementById('loginForm').style.display = form === 'cadastro' ? 'none' : 'block';
    document.getElementById('cadastroForm').style.display = form === 'cadastro' ? 'block' : 'none';
}

function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    icon.textContent = isPassword ? '🔒' : '👁️';
}

// Funções de usuário
async function loadUsers() {
    try {
        const response = await fetch('/usuarios');
        const users = await response.json();
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.email}</td>
                <td>${user.nivel_acesso}</td>
                <td>
                    <button class="action-button edit-button" onclick="editUser(${user.id}, '${user.email}', '${user.nivel_acesso}')">Editar</button>
                    <button class="action-button delete-button" onclick="deleteUser(${user.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

function editUser(id, email, nivelAcesso) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editEmail').value = email;
    document.getElementById('editNivelAcesso').value = nivelAcesso;
    document.getElementById('editSenha').value = '';
    document.getElementById('userList').style.display = 'none';
    document.getElementById('editForm').style.display = 'block';
}

function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('userList').style.display = 'block';
}

async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        const response = await fetch(`/usuarios/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadUsers();
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao excluir usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function logout() {
    document.getElementById('userList').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginSenha').value = '';
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(e.target))
            });
            const data = await response.json();
            const messageDiv = document.getElementById('loginMessage');
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = `Login realizado com sucesso! Nível de acesso: ${data.nivelAcesso}`;
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('userList').style.display = 'block';
                loadUsers();
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.error;
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    });

    // Cadastro form
    document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(e.target))
            });
            const data = await response.json();
            const messageDiv = document.getElementById('cadastroMessage');
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = data.message;
                e.target.reset();
                setTimeout(() => toggleForm('login'), 2000);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.error;
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    });

    // Edit form
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editUserId').value;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.senha) delete data.senha;

        try {
            const response = await fetch(`/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                cancelEdit();
                loadUsers();
            } else {
                const error = await response.json();
                alert(error.message || 'Erro ao atualizar usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    });
}); 
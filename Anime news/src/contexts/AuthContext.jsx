import { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Configurando listener de autenticação...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Estado de autenticação alterado:', currentUser ? 'Usuário logado' : 'Usuário deslogado');
      if (currentUser) {
        console.log('Dados do usuário:', {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        });
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    console.log('Iniciando processo de login com Google...');
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      console.log('Abrindo popup de autenticação...');
      const result = await signInWithPopup(auth, provider);
      console.log('Login com Google bem-sucedido:', {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL
      });
      return result.user;
    } catch (error) {
      console.error("Erro detalhado ao fazer login com Google:", {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      throw error;
    }
  };

  const logout = async () => {
    console.log('Iniciando processo de logout...');
    try {
      await signOut(auth);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
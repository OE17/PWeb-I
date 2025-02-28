import { getFirestore, collection, addDoc, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const favoritesCollection = collection(db, 'favorites');

export const addFavorite = async (animeData) => {
  const auth = getAuth();
  if (!auth.currentUser) throw new Error('Usuário não autenticado');

  try {
    await addDoc(favoritesCollection, {
      userId: auth.currentUser.uid,
      animeId: animeData.id,
      title: animeData.title,
      image: animeData.image,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao adicionar aos favoritos:', error);
    throw error;
  }
};

export const removeFavorite = async (animeId) => {
  const auth = getAuth();
  if (!auth.currentUser) throw new Error('Usuário não autenticado');

  try {
    const q = query(
      favoritesCollection,
      where('userId', '==', auth.currentUser.uid),
      where('animeId', '==', animeId)
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'favorites', document.id));
    });
  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error);
    throw error;
  }
};

export const getFavorites = async () => {
  const auth = getAuth();
  if (!auth.currentUser) throw new Error('Usuário não autenticado');

  try {
    const q = query(
      favoritesCollection,
      where('userId', '==', auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    throw error;
  }
};

export const checkIsFavorite = async (animeId) => {
  const auth = getAuth();
  if (!auth.currentUser) return false;

  try {
    const q = query(
      favoritesCollection,
      where('userId', '==', auth.currentUser.uid),
      where('animeId', '==', animeId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return false;
  }
}; 
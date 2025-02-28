import { 
  collection, 
  addDoc, 
  getDocs,
  getDoc, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const commentsCollection = collection(db, 'comments');

const validateComment = (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('O conteúdo do comentário é obrigatório');
  }
  if (content.trim().length === 0) {
    throw new Error('O comentário não pode estar vazio');
  }
  if (content.length > 1000) {
    throw new Error('O comentário não pode ter mais de 1000 caracteres');
  }
  return content.trim();
};

export const addComment = async (animeId, userId, userDisplayName, userPhotoURL, content) => {
  if (!animeId) throw new Error('ID do anime é obrigatório');
  if (!userId) throw new Error('ID do usuário é obrigatório');
  if (!userDisplayName) throw new Error('Nome do usuário é obrigatório');

  const validatedContent = validateComment(content);

  try {
    console.log('Iniciando adição de comentário:', { animeId, userId, content: validatedContent });
    
    // Verifica se a coleção existe
    const collectionRef = collection(db, 'comments');
    if (!collectionRef) {
      throw new Error('Coleção de comentários não encontrada');
    }

    const docRef = await addDoc(collectionRef, {
      animeId,
      userId,
      userDisplayName,
      userPhotoURL,
      content: validatedContent,
      likes: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Comentário adicionado com sucesso. ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro detalhado ao adicionar comentário:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    if (error.code === 'permission-denied') {
      throw new Error('Permissão negada. Verifique se você está logado.');
    }
    throw new Error('Não foi possível adicionar o comentário. Por favor, tente novamente.');
  }
};

export const getComments = async (animeId) => {
  if (!animeId) throw new Error('ID do anime é obrigatório');

  try {
    console.log('Iniciando busca de comentários para o anime:', animeId);
    
    const collectionRef = collection(db, 'comments');
    if (!collectionRef) {
      throw new Error('Coleção de comentários não encontrada');
    }

    // Busca sem ordenação primeiro
    const simpleQuery = query(
      collectionRef,
      where('animeId', '==', animeId)
    );

    const querySnapshot = await getDocs(simpleQuery);
    const comments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });

    // Ordena manualmente
    comments.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt - a.createdAt;
    });

    console.log('Comentários recuperados:', comments.length);
    return comments;
  } catch (error) {
    console.error('Erro detalhado ao buscar comentários:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    if (error.code === 'permission-denied') {
      throw new Error('Permissão negada ao acessar os comentários.');
    }
    throw new Error('Não foi possível carregar os comentários. Por favor, tente novamente.');
  }
};

export const deleteComment = async (commentId, userId) => {
  if (!commentId) throw new Error('ID do comentário é obrigatório');
  if (!userId) throw new Error('ID do usuário é obrigatório');

  try {
    console.log('Iniciando exclusão do comentário:', commentId);
    const commentRef = doc(db, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) {
      throw new Error('Comentário não encontrado');
    }
    
    if (commentSnap.data().userId !== userId) {
      throw new Error('Você não tem permissão para excluir este comentário');
    }

    await deleteDoc(commentRef);
    console.log('Comentário excluído com sucesso');
  } catch (error) {
    console.error('Erro detalhado ao excluir comentário:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    if (error.code === 'permission-denied') {
      throw new Error('Permissão negada ao excluir o comentário.');
    }
    throw new Error('Não foi possível excluir o comentário. Por favor, tente novamente.');
  }
};

export const updateComment = async (commentId, userId, content) => {
  if (!commentId) throw new Error('ID do comentário é obrigatório');
  if (!userId) throw new Error('ID do usuário é obrigatório');

  const validatedContent = validateComment(content);

  try {
    console.log('Iniciando atualização do comentário:', commentId);
    const commentRef = doc(db, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) {
      throw new Error('Comentário não encontrado');
    }
    
    if (commentSnap.data().userId !== userId) {
      throw new Error('Você não tem permissão para editar este comentário');
    }

    await updateDoc(commentRef, {
      content: validatedContent,
      updatedAt: serverTimestamp()
    });
    console.log('Comentário atualizado com sucesso');
  } catch (error) {
    console.error('Erro detalhado ao atualizar comentário:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    if (error.code === 'permission-denied') {
      throw new Error('Permissão negada ao atualizar o comentário.');
    }
    throw new Error('Não foi possível atualizar o comentário. Por favor, tente novamente.');
  }
};

export const toggleLike = async (commentId, userId) => {
  if (!commentId) throw new Error('ID do comentário é obrigatório');
  if (!userId) throw new Error('ID do usuário é obrigatório');

  try {
    console.log('Iniciando toggle de like:', { commentId, userId });
    const commentRef = doc(db, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) {
      throw new Error('Comentário não encontrado');
    }

    const commentData = commentSnap.data();
    const currentLikes = commentData.likes || [];
    
    let newLikes;
    if (currentLikes.includes(userId)) {
      newLikes = currentLikes.filter(id => id !== userId);
    } else {
      newLikes = [...currentLikes, userId];
    }
    
    await updateDoc(commentRef, { likes: newLikes });
    console.log('Like atualizado com sucesso');
    return newLikes;
  } catch (error) {
    console.error('Erro detalhado ao atualizar like:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    if (error.code === 'permission-denied') {
      throw new Error('Permissão negada ao atualizar o like.');
    }
    throw new Error('Não foi possível atualizar o like. Por favor, tente novamente.');
  }
}; 
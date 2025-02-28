import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  addComment, 
  getComments, 
  deleteComment, 
  updateComment, 
  toggleLike 
} from '../../services/commentService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AiOutlineLike, AiFillLike, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

const CommentSection = ({ animeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (animeId) {
      console.log('Iniciando carregamento de comentários para animeId:', animeId);
      loadComments();
    } else {
      console.error('animeId não fornecido para CommentSection');
      setError('ID do anime não encontrado');
    }
  }, [animeId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Chamando getComments com animeId:', animeId);
      const fetchedComments = await getComments(animeId);
      console.log('Comentários recebidos:', fetchedComments);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Erro detalhado ao carregar comentários:', error);
      const errorMessage = error.message || 'Erro ao carregar comentários';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para comentar');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Tentando adicionar comentário com dados:', {
        animeId,
        userId: user.uid,
        userDisplayName: user.displayName,
        userPhotoURL: user.photoURL,
        content: newComment
      });

      await addComment(
        animeId,
        user.uid,
        user.displayName,
        user.photoURL,
        newComment
      );
      
      setNewComment('');
      toast.success('Comentário adicionado com sucesso!');
      loadComments();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error(error.message || 'Erro ao adicionar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir comentários');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    try {
      console.log('Tentando excluir comentário:', commentId);
      await deleteComment(commentId, user.uid);
      toast.success('Comentário excluído com sucesso!');
      await loadComments();
    } catch (error) {
      console.error('Erro detalhado ao excluir comentário:', error);
      const errorMessage = error.message || 'Erro ao excluir comentário';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId) => {
    if (!user) {
      toast.error('Você precisa estar logado para editar comentários');
      return;
    }

    if (!editContent.trim()) {
      toast.error('O comentário não pode estar vazio');
      return;
    }

    if (editContent.length > 1000) {
      toast.error('O comentário não pode ter mais de 1000 caracteres');
      return;
    }

    try {
      console.log('Tentando atualizar comentário:', {
        commentId,
        userId: user.uid,
        content: editContent.trim()
      });

      await updateComment(commentId, user.uid, editContent.trim());
      setEditingComment(null);
      toast.success('Comentário atualizado com sucesso!');
      await loadComments();
    } catch (error) {
      console.error('Erro detalhado ao atualizar comentário:', error);
      const errorMessage = error.message || 'Erro ao atualizar comentário';
      toast.error(errorMessage);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      toast.error('Faça login para curtir comentários');
      return;
    }

    try {
      console.log('Tentando alternar like:', {
        commentId,
        userId: user.uid
      });

      await toggleLike(commentId, user.uid);
      await loadComments();
    } catch (error) {
      console.error('Erro detalhado ao curtir comentário:', error);
      const errorMessage = error.message || 'Erro ao curtir comentário';
      toast.error(errorMessage);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  const getCharacterCount = () => {
    return newComment.length;
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Faça login para participar da discussão
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Comentários
      </h3>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
          <p className="font-medium">Erro ao carregar comentários:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Formulário de novo comentário */}
      <form onSubmit={handleAddComment} className="space-y-4">
        <div className="flex items-start space-x-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Foto de perfil'}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {(user.displayName || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Deixe seu comentário..."
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows="3"
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400">
              {getCharacterCount()}/1000
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className={`px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Enviando...' : 'Comentar'}
          </motion.button>
        </div>
      </form>

      {/* Lista de comentários */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
            >
              <div className="flex items-start space-x-4">
                {comment.userPhotoURL ? (
                  <img
                    src={comment.userPhotoURL}
                    alt={`${comment.userDisplayName}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {(comment.userDisplayName || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.userDisplayName}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    {user && user.uid === comment.userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-gray-500 hover:text-primary dark:text-gray-400"
                        >
                          <AiOutlineEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-400"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        rows="3"
                        maxLength={1000}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setEditingComment(null)}
                          className="px-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleUpdate(comment.id)}
                          className="px-4 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  )}
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center space-x-1 text-sm ${
                        comment.likes?.includes(user?.uid)
                          ? 'text-primary'
                          : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                      }`}
                    >
                      {comment.likes?.includes(user?.uid) ? (
                        <AiFillLike size={20} />
                      ) : (
                        <AiOutlineLike size={20} />
                      )}
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!loading && comments.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 
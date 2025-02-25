class animesDAO {
    // READ - Retorna até 10 animes ordenados pelo título
    static async getAnimes(client) {
        const cursor = await client
            .find()
            .project({ _id: 0 })  // Exclui o campo _id da resposta
            .sort({ titulo: 1 })   // Ordena pelo título
            .limit(10);            // Limita a 10 resultados
        try {
            const results = await cursor.toArray();
            return results;
        } catch (err) {
            console.log(err);
        }
    }

    // CREATE - Insere um novo anime
    static async insertAnime(client, doc) {
        try {
            const result = await client.insertOne(doc);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    // DELETE - Deleta um anime pelo título
    static async deleteAnimeByTitulo(client, titulo) {
        try {
            const result = await client.deleteOne(titulo);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    // UPDATE - Atualiza a nota de um anime pelo título
    static async updateNotaByTitulo(client, titulo, novaNota) {
        try {
            const result = await client.updateOne(titulo, novaNota);
            return result;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = animesDAO;

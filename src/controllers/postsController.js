import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

/**
 * Lista todos os posts do banco de dados.
 * 
 * @async
 * @param {object} req - Objeto de requisição HTTP
 * @param {object} res - Objeto de resposta HTTP
 */
export async function listarPosts(req, res) {
  // Busca todos os posts no banco de dados utilizando a função getTodosPosts
  const posts = await getTodosPosts();

  // Envia os posts como resposta em formato JSON com status 200 (sucesso)
  res.status(200).json(posts);
}

/**
 * Cria um novo post no banco de dados.
 * 
 * @async
 * @param {object} req - Objeto de requisição HTTP
 * @param {object} res - Objeto de resposta HTTP
 */
export async function postarNovoPost(req, res) {
  const novoPost = req.body;

  try {
    // Chama a função criarPost para inserir o novo post no banco de dados
    const postCriado = await criarPost(novoPost);

    // Retorna o post criado como resposta com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);

    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

/**
 * Faz o upload de uma imagem para um post existente.
 * 
 * **Observação:** Esta função parece incompleta, pois não atualiza o post com o caminho da imagem.
 * 
 * @async
 * @param {object} req - Objeto de requisição HTTP
 * @param {object} res - Objeto de resposta HTTP
 */
export async function uploadImagem(req, res) {
  const novoPost = {
    descricao: "",
    imgurl: req.file.originalname,
    alt: ""
  };

  try {
    // Cria um novo post no banco de dados (isso parece redundante se o objetivo é apenas atualizar a imagem)
    const postCriado = await criarPost(novoPost);

    // Gera um novo nome para o arquivo e define o caminho completo
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

    // Move o arquivo para o diretório de uploads
    fs.renameSync(req.file.path, imagemAtualizada);

    // Retorna o post criado como resposta (novamente, parece redundante)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);

    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

/**
 * Atualiza um post no banco de dados.
 * 
 * @async
 * @param {object} req - Objeto de requisição HTTP
 * @param {object} res - Objeto de resposta HTTP
 */
export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;


  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);

    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    };

    // Chama a função atualizarPost para atualizar o post no banco de dados
    const postCriado = await atualizarPost(id, post);

    // Retorna o post criado como resposta com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);

    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}
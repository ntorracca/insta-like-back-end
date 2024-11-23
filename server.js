import express from "express";
import conectarAoBanco from  "./src/config/dbConfig.js"
import routes from "./src/routes/postsRoutes.js";


const app = express();
app.use(express.static("uploads"));

routes(app);


// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor escutando ...");
});


// function buscarPostPorID(id) {
//     return posts.findIndex((post) => {
//         return post.id === Number(id);
//     })
// }

// app.get("/posts/:id", (req, res) => {
//     const index = buscarPostPorID(req.params.id);
//     res.status(200).json(posts[index]);
// });
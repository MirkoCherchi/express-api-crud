const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Funzione per generare lo slug basato sul titolo
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

const store = async (req, res) => {
  const { title, content } = req.body;
  const slug = generateSlug(title);

  const data = {
    title,
    slug,
    content,
    published: req.body.published ? true : false,
  };
  try {
    const post = await prisma.post.create({ data });
    res.status(200).send(post);
  } catch (error) {
    console.error("Qualcosa è andato storto", error);
    res.status(500).send("Errore durante la creazione del post");
  }
};

module.exports = { store };

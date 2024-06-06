const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

const index = async (req, res) => {
  try {
    const { published } = req.query;
    const where = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    const { page = 1, limit = 5 } = req.query;

    const offset = (page - 1) * limit;

    const totalItems = await prisma.post.count({ where });

    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      throw new Error("La pagina richiesta non esiste.");
    }

    const posts = await prisma.post.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json({
      data: posts,
      page: parseInt(page),
      totalItems,
      totalPages,
    });
  } catch (error) {
    console.error("Qualcosa è andato storto", error);
    res.status(500).send("Errore durante il recupero dei post");
  }
};

const show = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send(`Post con lo slug ${slug} non trovato.`);
    }
  } catch (err) {
    console.error("Qualcosa è andato storto", err);
    res.status(500).send("Errore durante il recupero del post");
  }
};

const update = async (req, res) => {
  try {
    const { slug } = req.params;
    const postData = req.body;

    if (postData.title) {
      const newSlug = generateSlug(postData.title);
      postData.slug = newSlug;
    }
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: postData,
    });

    res.json(updatedPost);
  } catch (err) {
    console.error("Qualcosa è andato storto", err);
    res.status(500).send("Errore durante la modifica del post");
  }
};

module.exports = { update };

const destroy = async (req, res) => {
  const { slug } = req.params;
  await prisma.post.delete({
    where: { slug },
  });
  res.json(`Post con slug ${slug} eliminato con successo.`);
};

module.exports = { store, index, show, update, destroy };

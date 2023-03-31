import Post from "../models/Post.js";

export const create = async (req, resp) => {
  try {
    const { title, text, imageUrl, tags } = req.body;
    const doc = new Post({
      title,
      text,
      imageUrl,
      tags,
      user: req.userId,
    });

    const post = await doc.save();

    resp.json(post);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Can not create post!",
    });
  }
};

export const getAll = async (req, resp) => {
  try {
    const posts = await Post.find().populate("user").exec(); // Отримуємо користувача

    resp.json(posts);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "All posts unrichable ",
    });
  }
};

export const getOne = async (req, resp) => {
  try {
    const postId = req.params.id;
    //Повертаємо стат'ю, та інкрементуємо перегляд
    const update = { $inc: { viewsCount: 1 } };
    let doc = await Post.findByIdAndUpdate(postId, update)
      .populate("user")
      .exec();

    resp.json(doc);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "All posts unrichable ",
    });
  }
};

export const deletePost = async (req, resp) => {
  try {
    const postId = req.params.id;
    let doc = await Post.findByIdAndDelete(postId);
    resp.json({ message: "Delete done! " + doc });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Cannot delete a post",
    });
  }
};

export const update = async (req, resp) => {
  try {
    const postId = req.params.id;
    const { title, text, imageUrl, tags } = req.body;
    const update = { title, text, imageUrl, tags };

    const doc = await Post.findByIdAndUpdate(postId, update);

    resp.json({ message: "Update Done! " + doc });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Cannot update a post",
    });
  }
};

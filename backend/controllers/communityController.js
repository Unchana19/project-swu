const Commnunities = require("../models/Communities");

exports.create = async (req, res) => {
    const { author, content } = req.body;

    switch (true) {
        case !content:
            return res.status(400).json({ error: "invalid content" });
    }

    try {
        const community = await Commnunities.create({author, content});
        res.json(community);
    } catch (err) {
        res.status(400).json({error: err.massage});
    }
}

exports.getAllPosts = (req, res) => {
    Commnunities.find({}).sort({ createdAt: -1 }).exec()
    .then(posts => {
        res.json(posts);
    }).catch(err => {
        res.status(500).json({error: "Internal Server Error"});
    });
}

exports.removePost = (req, res) => {
    const {postId} = req.params;
    Commnunities.findOneAndDelete({ _id: postId })
    .then(post => {
        res.json({message: "ลบโพสต์สำเร็จ"});
    }).catch(err => {
        res.status(500).json({error: "Internal Server Error"});
    });
}

exports.updatePost = (req, res) => {
    const {postId} = req.params;
    const {author, content} = req.body;
    Commnunities.findOneAndUpdate({_id: postId}, {author, content}, {new: true}).exec()
    .then(post => {
        res.json({message: "อัพเดตโพสต์สำเร็จ"});
    }).catch(err => {
        res.status(500).json({error: "Internal Server Error"});
    })
}
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/playground")
    .then(() => console.log('Connected...'))
    .catch(error => console.log(error.message));

const genreSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    isPublished: Boolean,
    date: {type: Date, default: Date.now}
});

const Genre = mongoose.model('Genre', genreSchema);

async function updateGenre(id: string, new_name: string) {
    const genre = await Genre.findById(id);

    if (!genre) return;

    genre.set({
        name: new_name
    });

    return await genre.save();
}

async function run() {
    const result = await updateGenre("65a42e0b01b08169e5c29dcb", "comedy");
    console.log(result);
}

run();
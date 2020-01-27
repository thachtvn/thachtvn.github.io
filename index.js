const fs = require('fs');

module.exports = {
    getAllBooks: (req, res) => {
        console.log('getAllBooks');
        let query = "SELECT * FROM `books` ORDER BY id ASC"; // query database to get all the players
        // execute query
        connect.query(query, (err, result) => {
            if (err) {
                console.log('error query')
                res.redirect('/');
            }
            console.log(result);
            res.render('index.ejs', {
                message: '',
                books: result
            });
        });
    },
    addBook: (req, res) => {
        console.log('addBooks');
        // console.log(req.body);
        // console.log(req.files);
        let name = req.body.name;
        let author = req.body.author;
        let description = req.body.description;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = name + '.' + fileExtension;
        // check file 
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /img directory
            uploadedFile.mv(`img/${image_name}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                // send the player's details to the database
                let query = "INSERT INTO `books` (name, author, description, image) VALUES ('" +
                    name + "', '" + author + "', '" + description + "', '" + image_name + "')";
                connect.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    console.log(query);
                    res.redirect("/");
                });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            // res.render('index.ejs', {
            //     message
            // });
        }
    },
    deleteBook: (req, res) => {
        console.log('deletePlayer');
        let bookId = req.params.id;
        let getImageQuery = 'SELECT image from `books` WHERE id = "' + bookId + '"';
        let deleteBookQuery = 'DELETE FROM books WHERE id = "' + bookId + '"';
        console.log(getImageQuery);
        console.log(deleteBookQuery);
        connect.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(result);
            let image = result[0].image;

            fs.unlink(`img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                connect.query(deleteBookQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    },
    editBook: (req, res) => {
        console.log('editBooks');
        let id = req.body.id;
        let name = req.body.name;
        let author = req.body.author;
        let description = req.body.description;
        // case: edit image 
        if (req.files) {
            let uploadedFile = req.files.image;
            let image_name = uploadedFile.name;
            let fileExtension = uploadedFile.mimetype.split('/')[1];
            image_name = name + '.' + fileExtension;
            let getImageQuery = 'SELECT image from `books` WHERE id = "' + id + '"';
            console.log(getImageQuery);
            connect.query(getImageQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                console.log(result);
                let image = result[0].image;

                fs.unlink(`img/${image}`, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            });
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                // upload the file to the /img directory
                uploadedFile.mv(`img/${image_name}`, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            }
            let updateImageQuery = "UPDATE `books` SET `image` = '" + image_name + "' WHERE `books`.`id` = '" + id + "'";
            connect.query(updateImageQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                console.log(updateImageQuery);
            });
        }
        let updateQuery = "UPDATE `books` SET `name` = '" + name + "', `author` = '" + author + "', `description` = '" + description + "' WHERE `books`.`id` = '" + id + "'";
        connect.query(updateQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
            console.log(updateQuery);
        });
    }
};
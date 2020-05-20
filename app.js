const express = require('express');
const mysql = require('mysql');
const fs = require('fs')
const request = require('request')

//mysql://bfc148d01d2b40:eee07c6c@us-cdbr-east-06.cleardb.net/heroku_5b4be569d534dc8?reconnect=true
const db = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bfc148d01d2b40',
    password: 'eee07c6c',
    database: 'heroku_5b4be569d534dc8'

});
//connect
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('MySql Connected...');

});

const app = express();



//create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE preshydb'
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);

        res.send('Database created ...');
    })
})

app.get('/createuserstable', (req, res) => {
    let sql = 'CREATE TABLE Users(id int AUTO_INCREMENT, name VARCHAR(255), username VARCHAR(255), email VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Users table created....');
    });
});


app.get('/populate', (req, res) => {
    request({
        url: "http://jsonplaceholder.typicode.com/users",
        json: true
    }, (err, resp, body) => {
        //res.send(typeof body);
        for (var i = 0; i < body.length; i++) {

            let post = { id: body[i].id, name: body[i].name, username: body[i].username, email: body[i].email };
            let sql = 'INSERT INTO users SET?';
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        };
        res.send('users data added....')
    });

});

app.get('/delete', (req, res) => {

    let sql = "SELECT * FROM users";

    db.query(sql, function (err, result) {
        if (err) throw err;
        let sqls = `DELETE FROM users WHERE id = ${result.length}`;
        let query = db.query(sqls, (err, resul) => {
            if (err) throw err;
            // console.log(resul);
            res.send('user deleted....');

        });

    });

});

// app.get('/adduser', (req, res) => {
//     let post = { id: 1, name: 'neymar', username: 'NMJR', email: 'neymarjr@gmail.com' };
//     let sql = 'INSERT INTO users SET?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('single user added....');

//     });
// });


// app.get('/addpost1', (req, res) => {
//     let post = { title: 'Post One', body: 'This is post number one' };
//     let sql = 'INSERT INTO posts SET?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Posts 1 added....');

//     });
// });

// app.get('/addpost2', (req, res) => {
//     let post = { title: 'Post Two', body: 'This is post number two' };
//     let sql = 'INSERT INTO posts SET?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Posts 2 added....');

//     });
// });


//select users
app.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM users';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
        res.send('Users fetched....');

    });
});
// //select single posts
// app.get('/getpost/:id', (req, res) => {
//     let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Post fetched....');

//     });
// });

// //update post
// app.get('/updatepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
//     let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Post updated....');

//     });
// });

// //delete post
// app.get('/deletepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
// let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
// let query = db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send('Post deleted....');

// });
// });


app.listen('3000', () => {
    console.log('Server started on port 3000');
});


const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan')
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '41169',
    database: 'mydb'
})

con.connect(err => {
    if (err) console.log(err);
    else {
        console.log('Connected to DB');
        app.listen(4000);
    }
});

app.get('/', (req, res) => {
    con.query('select * from student', (err,result) => {
        if (err) console.log(err);
        else {
            res.render('home', {title : 'Home Page', students : result});
        };
    });
});

app.get('/about', (req, res) => {
    res.render('about', {title : 'About Us'});
});

app.get('/create', (req, res) => {
    res.render('create', {title : 'New Student'});
});

app.post('/', (req, res) => {
    query = `insert into student (rno, name) values ('${req.body['rno']}','${req.body['name']}')`;
    con.query(query, (err,result) => {
        if (err) console.log(err);
        else res.redirect('/');
    });
});

app.delete('/del/:id', (req, res) => {
    const id = req.params.id;
    query = `delete from student where rno = '${id}'`;
    con.query(query, (err,result) => {
        if (err) console.log(err);
        else {
            res.json({ redirect : '/' });
        }
    });
});

app.get('/upd/:id', (req, res) => {
    const id = req.params.id;
    res.json({ redirect : `updForm/${id}`});
});

app.get('/updForm/:id', (req, res) => {
    const id = req.params.id;
    con.query(`select * from student where rno = '${id}'`, (err,result) => {
        res.render('updForm', {title : 'Edit Student Details', student : result[0]});
    });
});

app.post('/updForm/:id', (req, res) => {
    const id = req.params.id;
    query = `update student set name = '${req.body['name']}' where rno = '${id}'`;
    con.query(query, (err,result) => {
        if (err) console.log(err);
        else {
            console.log(result);
            res.redirect('/');
        }
    });
});

app.use((req,res) => {
    res.status(404).render('404', {title : '404 Not Found'});
});
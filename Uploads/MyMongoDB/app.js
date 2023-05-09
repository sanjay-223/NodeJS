const express = require('express');
const morgan = require('morgan');
const mon = require('mongoose');
const Student = require('./models/student');
const { result } = require('lodash');

const app = express();
const dbURI = "mongodb://127.0.0.1:27017/stud";

mon.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res) => {
    Student.find()
        .then(students => {
            res.render('home', {title : 'Home Page', students});
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/about',(req,res) => {
    res.render('about', {title : 'About Us'});
});

app.get('/create',(req,res) => {
    res.render('create', {title : 'New Student'});
})

app.post('/', (req, res) => {
    const student = new Student(req.body);
    student.save()
        .then(result => {
            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        });
});

app.delete('/del/:id', (req, res) => {
    Student.findOneAndRemove({ rno: req.params.id})
        .then(result => {
            res.json({ redirect : '/'})
        })
        .catch(err => {
            console.log(err)
        });
})

app.get('/upd/:id', (req, res) => {
    const id = req.params.id;
    res.json({ redirect : `/updForm/${id}`});
})

app.get('/updForm/:id', (req, res) => {
    Student.findOne({ rno : req.params.id})
        .then( result => {
            //console.log(result,'Form Get');
            res.render('updForm', { title : 'Update Student', student : result[0].rno});
        })
        .catch(err => {
            console.log(err)
        });
});

app.post('/updForm/:id', (req, res) => {
    Student.updateOne({ rno : req.params.id},{$set : {name : req.body.name}}, (err, result) => {
        if (err) console.log(err);
        else {
            //console.log(result, 'Form Post');
            res.redirect('/');
        }
    }); 
});

app.use((req,res) => {
    res.status(404).render('404', {title : '404 Not Found'});
});
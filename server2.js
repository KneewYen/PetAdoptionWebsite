//
//Nguyen Le
//ID: 40272922
//SOEN 287- Winter 2024
//Assignment 03
//Concordia University
//Date:  15 April 2024


// this is the server for the website


const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const session = require('express-session');
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
const usersFilePath = path.join(__dirname, 'data', 'users.txt');
const petsFilePath = path.join(__dirname, 'data', 'pets.txt');
app.use(express.json());
function verifyUser(username) {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = usersData.trim().split('\n');
    return users.some(user => {
        const [storedUsername] = user.split(':');
        return storedUsername === username;  
    });
}




function registerUser(username, password) {
    const newUser = `${username}:${password}\n`;
    fs.appendFileSync(usersFilePath, newUser, 'utf8');
}
function searchPets(criteria) {
    const { type, breed, age, gender, otherdogs, othercats, smallchildren } = criteria;
    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const pets = petsData.trim().split('\n').map(line => {
        const parts = line.split(':');
        return {
            id: parts[0],
            username: parts[1],
            type: parts[2],
            breed: parts[3],
            age: parts[4],
            gender: parts[5],
            getsAlongWithOtherDogs: parts[6] === "yes",
            getsAlongWithCats: parts[7] === "yes",
            getsAlongWithChildren: parts[8] === "yes",
            description: parts[9],
            ownerFirstName: parts[10],
            ownerLastName: parts[11],
            ownerEmail: parts[12]
        };
    });

    return pets.filter(pet => {
        const breedMatch = breed === "Doesn't matter" || pet.breed.toLowerCase().includes(breed.toLowerCase());
        const ageMatch = age === "Doesn't matter" || pet.age === age;
        const genderMatch = gender === "Doesn't matter" || pet.gender.toLowerCase() === gender.toLowerCase();
        const dogsMatch = !otherdogs || pet.getsAlongWithOtherDogs;
        const catsMatch = !othercats || pet.getsAlongWithCats;
        const childrenMatch = !smallchildren || pet.getsAlongWithChildren;

        return pet.type.toLowerCase() === type.toLowerCase() && breedMatch && ageMatch && genderMatch && dogsMatch && catsMatch && childrenMatch;
    });
}



app.get('/', (req, res) => {
    res.render('home', { title: 'Home' }); 
});

app.get('/create-account', (req, res) => {
    res.render('create-account', { title: 'create-account' });
});

app.post('/create-account', (req, res) => {
    const { username, password } = req.body;
    console.log(`Attempting to register username: '${username}'`);

    if (verifyUser(username)) {
        console.log("Username already exists: ", username);
        res.status(409).json({ message: "Username already exists, please choose another one." });
    } else {
        console.log("Registering new user: ", username);
        registerUser(username, password);
        res.json({ message: "Account created successfully. You can now login." });
    }
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (verifyUser(username, password)) {
        req.session.username = username;  
       
    } else {
        res.send('Login failed! Please try again.');
    }
});


app.post('/give-away', (req, res) => {
    if (req.session.username) {
        const petData = req.body;
        const petId = getNextPetId();
        const petRecord = `${petId}:${req.session.username}:${Object.values(petData).join(':')}\n`;

        fs.appendFileSync(petsFilePath, petRecord, 'utf8');
        res.send('Registering your pet successfully');
        
    } else {
        res.redirect('/login');
    }
});



function getNextPetId() {
    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const lastId = petsData.trim().split('\n').reduce((maxId, line) => {
        const id = parseInt(line.split(':')[0]);
        return id > maxId ? id : maxId;
    }, 0);
    return lastId + 1;
}




app.get('/find-pet', (req, res) => {
    res.render('find-pet', { title: 'Find a Dog/Cat', pets: undefined });
});


app.post('/find-pet', (req, res) => {
    const results = searchPets(req.body);
    res.render('find-pet', { title: 'Find a Dog/Cat', pets: results });
});




app.get('/dog-care', (req, res) => {
    res.render('dog-care', { title: 'Dog Care' }); 
});

app.get('/cat-care', (req, res) => {
    res.render('cat-care', { title: 'Cat Care' }); 
});

app.get('/give-away', (req, res) => {
    if (req.session.username) {
        res.render('give-away', { title: 'Give Away' });  
    } else {
        res.redirect('/login');  
    }
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' }); 
});
app.get('/login', (req, res) => {
    res.render('login', { title: 'login' }); 
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.send("Error logging out");
            return;
        }
      
        res.render('logout', { title: 'Logout', message: "You have been successfully logged out." });
    });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'privacy' }); 
});


app.listen(5411, () => {
    console.log('Server is running on port 5411');
});


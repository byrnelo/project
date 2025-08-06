// Lorraine Byrne and Suhayl Khan
// CS 340 Summer 2025
// Roll the Dice Database
// Citations:
// Structures and Setup:
//https://canvas.oregonstate.edu/courses/2007765/assignments/10118865
// https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// Handlebar:
// https://handlebarsjs.com/guide/
// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 10580;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/Games', async function (req, res) {
  try {
    const [games] = await db.query('SELECT * FROM Games');
    res.render('Games', { Games: games });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while executing the database queries.');
  }
});

app.get('/Genres', async function (req, res) {
    try {
        const [genres] = await db.query('SELECT * FROM Genres;');
        res.render('Genres', { Genres: genres });
    } catch (error) {
        console.error('Error retrieving genres:', error);
        res.status(500).send('An error occurred while loading the Genres page.');
    }
});

app.get('/GamesGenres', async function (req, res) {
    try {
        const query1 = `
            SELECT Games.gameName, Genres.genreName
            FROM GamesGenres
            JOIN Games ON GamesGenres.gameID = Games.gameID
            JOIN Genres ON GamesGenres.genreID = Genres.genreID
            ORDER BY GamesGenres.gameID;
            `;
        const query2 = `SELECT gameID, gameName FROM Games`
        const query3 = `SELECT genreID, genreName FROM Genres`
        const [gamesGenres] = await db.query(query1);
        const [games] = await db.query(query2)
        const [genres] = await db.query(query3)
        res.render('GamesGenres', { GamesGenres: gamesGenres, Games: games, Genres: genres });
    } catch (error) {
        console.error('Error retrieving gamesgenres:', error);
        res.status(500).send('An error occured while loading the GamesGenres page.')
    }
})

app.get('/Tables', async function (req, res) {
    try {
        const [tables] = await db.query('SELECT * FROM Tables;');
        res.render('Tables', { Tables: tables });
    } catch (error) {
        console.error('Error retrieving tables:', error);
        res.status(500).send('An error occurred while loading the Tables page.');
    }
});

app.get('/Patrons', async function (req, res) {
    try {
        const [patrons] = await db.query('SELECT * FROM Patrons;');
        res.render('Patrons', { Patrons: patrons });
    } catch (error) {
        console.error('Error retrieving patrons:', error);
        res.status(500).send('An error occurred while loading the Patrons page.');
    }
});

app.get('/Reservations', async function (req, res) {
    try {
        const [reservations] = await db.query('SELECT * FROM Reservations;');
        res.render('Reservations', { Reservations: reservations });
    } catch (error) {
        console.error('Error retrieving reservations:', error);
        res.status(500).send('An error occurred while loading the Reservations page.');
    }
});

// RESET Route
app.post('/Reset', async function (req, res) {
    try {
        const query = `CALL sp_load_gamesdb();`;
        await db.query(query);
        res.redirect('/');
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).send('An error occurred while resetting the database.');
    }
})

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});

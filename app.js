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

const PORT = 10581;

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
        const query3 = `SELECT genreID, genreName FROM Genres ORDER BY genreID ASC`
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

// RESET ROUTE
app.post('/Reset', async function (req, res) {
    try {
        const query = `CALL sp_load_gamesdb();`;
        await db.query(query);
        res.redirect('/');
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).send('An error occurred while resetting the database.');
    }
});

// CREATE ROUTES
app.post('/Games/Create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_game(?, ?, ?, ?, ?, @new_id)`;

        const [[[row]]] = await db.query(query, [
            data.create_game_name,
            data.create_game_description,
            data.create_game_min,
            data.create_game_max,
            data.create_game_quantity
        ]);

        console.log(`CREATE Games. ID: ${row.new_id} ` +
            `Game: ${data.create_game_name}`
        );

        res.redirect('/Games');
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).send('An error occurred while creating a Game.');
    }
})

app.post('/Genres/Create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_genre(?, @new_id);`;

        const [[[row]]] = await db.query(query, [data.create_genre_name]);

        console.log(`CREATE Genres. ID: ${row.new_id} ` +
            `Genre: ${data.create_genre_name}`
        );

        res.redirect('/Genres');
    } catch (error) {
        console.error('Error creating genre:', error);
        res.status(500).send('An error occurred while creating a Genre.');
    }
})

app.post('/GamesGenres/Create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_gamegenre(?, ?);`;

        await db.query(query, [
            data.create_gamesGenres_gameID,
            data.create_gamesGenres_genreID
        ]);

        console.log(`
            CREATE GamesGenres. gameID: ${data.create_gamesGenres_gameID}
            associated with genreID: ${data.create_gamesGenres_genreID}
        `);

        res.redirect('/GamesGenres');
    } catch (error) {
        console.error('Error creating game genre relationship:', error);
        res.status(500).send('An error occurred while creating a GameGenre.');
    }
})

app.post('/Tables/Create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_table(?, @new_id);`;

        const [[[row]]] = await db.query(query, [data.create_max_seating]);

        console.log(`CREATE Table. ID: ${row.new_id} ` +
            `Max Seating: ${data.create_max_seating}`
        );

        res.redirect('/Tables');
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).send('An error occurred while creating a Table.');
    }
})

app.post('/Patrons/Create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_patron(?, ?, ?, ?, @new_id);`;

        const [[[row]]] = await db.query(query, [
            data.create_first_name,
            data.create_last_name,
            data.create_phone_number,
            data.create_email
        ]);

        console.log(`CREATE Patron. ID: ${row.new_id} ` +
            `Patron: ${data.create_first_name} ${data.create_last_name}`
        );

        res.redirect('/Patrons');
    } catch (error) {
        console.error('Error creating patron:', error);
        res.status(500).send('An error occurred while creating a Patron.');
    }
})

app.post('/Reservations/Create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_reservation(?, ?, ?, ?, ?, ?, @new_id);`;

        const [[[row]]] = await db.query(query, [
            data.create_patron_id,
            data.create_table_id,
            data.create_game_id,
            data.create_date,
            data.create_time_start,
            data.create_time_end,
        ]);

        console.log(`CREATE Reservation. ID: ${row.new_id} ` +
            `Date: ${data.create_date} at ${data.create_time_start}`
        );

        res.redirect('/Reservations');
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).send('An error occurred while creating a Reservation.');
    }
})

// UPDATE ROUTES
app.post('/Games/Update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_update_game(?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            data.update_game_id,
            data.update_game_name,
            data.update_game_description,
            data.update_game_min,
            data.update_game_max,
            data.update_game_quantity
        ])

        console.log(`UPDATE Games. ID: ${data.update_game_id} ` +
            `Game: ${data.update_game_name}`
        );

        res.redirect('/Games');
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).send('An error occurred while updating a Game.');
    }
})

app.post('/Genres/Update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_update_genre(?, ?)`;

        await db.query(query, [
            data.update_genre_id,
            data.update_genre_name
        ])

        console.log(`UPDATE Genres. ID: ${data.update_genre_id} ` +
            `Genre: ${data.update_genre_name}`
        );

        res.redirect('/Genres');
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).send('An error occurred while updating a Game.');
    }
})

app.post('/GamesGenres/Update', async function (req, res) {
    try {
        let data = req.body;
        const [gameName, genreName] = data.update_gamesGenres_gameGenreName.split('+');

        const query = `CALL sp_update_gamegenre(?, ?, ?)`;

        await db.query(query, [
            gameName,
            genreName,
            data.update_gamesGenres_genreID
        ]);

        console.log(`UPDATE GamesGenres. ${gameName} genre updated`);

        res.redirect('/GamesGenres');
    } catch (error) {
        console.error('Error updating game genre:', error);
        res.status(500).send('An error occurred while updating a GameGenre.');
    }
})

app.post('/Tables/Update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_update_table(?, ?)`;

        await db.query(query, [
            data.update_table_id,
            data.update_max_seating
        ]);

        console.log(`UPDATE Tables. ID: ${data.update_table_id} ` +
            `Max Seating: ${data.update_max_seating}`
        );

        res.redirect('/Tables');
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(500).send('An error occurred while updating a Table.');
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

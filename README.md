# Reservation Managment Database

## Overview
Pass The Dice is a board game cafe that recently opened in a bustling area that allows patrons to reserve a table and games to play with friends. The owners of the cafe are looking for a website with a database backend to help keep track of all their games and table reservations. 
The cafe currently owns around 20 board games and is slowly building their collection (so they want to be able to easily add/remove game titles). They also have 10 tables that range from 2 - 8 people. On average, the cafe sees approximately 30 patrons on the weekdays and 50 patrons on the weekends. 
Tracking includes recording active tables and game reservations. The cafe's goal is to be able to take reservations based on party size, available tables, and available games. 
The database driven website will help both the owners of the cafe to better serve their patrons by keeping an active schedule and allow users to book time slots as well as games that they want to play.
As such, the database for Pass the Dice will include entities
**Games**: game ID, game name, description, min and max player, quantity
**Genres**: genre ID, genre name
**Tables**: table ID, max seating
**Patrons**: patron ID, first name, last name, phone number, email
**Reservations**: reservation ID, patron ID, table ID, game ID, date, time start, time end 

## Database Outline:
**Games**: All the games that the cafe owns along with some brief information about them
gameID: int, auto_increment, unique, not NULL, PK
gameName: varchar, not NULL
description: varchar
minPlayer: int, not NULL
maxPlayer: int, not NULL
quantity: int, not NULL

**Relationship 1:** a M:N relationship between Genres and Games is implemented with the genreID and gameID as FKs in GamesGenres intersection table.

**Genres**: Genres of the board games like action, story, and puzzle
genreID: int, auto_increment, unique, not NULL, PK
genreName: varchar, not NULL 

**Relationship 1:** a 1:M relationship between Games and Reservations is implemented with the gameID as a FK in the Reservations table.
**Relationship 2:** a M:N relationship between Games and Genres is implemented with the gameID and genreID as FKs in GamesGenres intersection table.

**Tables**: Tabled available for patrons to sit and play a board game either solo or with a group.
tableID: int, auto_increment, unique, not NULL, PK
maxSeating: int, not NULL

**Relationship 1:** a 1:M relationship between Tables and Reservations with the tableID as the FK inside of Reservations.

**Patrons**: Patron information for people looking to utilzie the cafe space and check out a game and a table.
patronID: int, auto_increment, unique, not NULL, PK 
firstName: varchar, not NULL
lastName: varchar, not NULL
phoneNumber: varchar, not NULL
email: varchar, not NULL

**Relationship 1:** a 1:M relationship between Patrons and Reservations is implemented with patronID as a FK inside of Reservations.

**Reservations**: Reservations of patrons looking to utilize the space
reservationID: int, auto_increment, unique, not NULL, PK
patronID: int, not NULL, FK
tableID: int, not NULL, FK
gameID: int, not NULL, FK
date: date, not NULL
timeStart: time, not NULL
timeEnd: time, not NULL

**Relationship 1:** a 1:M relationship between Patrons and Reservations is implemented with patronID as a FK inside of Reservations.
**Relationship 2:** a 1:M relationship between Tables and Reservations is implemented with tableID as a FK inside of Reservations.
**Relationship 3:** a 1:M relationship between Games and Reservations is implemented with gameID as a FK inside of Reservations.

**Games Genres**: Intersection table representing the many-to-many relationship between the Games and Genres entities.
reservationID: int, auto_increment, unique, not NULL, PK
gameID: int, not NULL, FK
genreID: int, not NULL, FK

**Relationship 1:** a 1:M relationship between Games and GamesGenres is implemented with gameID as a FK inside GamesGenres.
**Relationship 2:**  a 1:M relationship between Genres and GamesGenres is implemented with genreID as a FK inside GamesGenres.

## Schema 
![Alt Text]./schema.png)

## Run Modes
### Local
* Build and Run: `npm run start`
* Build and Run in Debug (nodemon): `npm run development`

### Production
* Build and Run with Forever: `npm run production`
* Stop Forever Production Run: `npm run stop production`

  Citations:
  

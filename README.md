# GETTING STARTED

1- Clone this repo

2- Run `npm install` to install all dependencies.

3- Rename `.env.local` to `.env` and set these variables accordingly.

4- Instructions for to create a database and user in postgres
 - make sure you have `psql` in your environmental paths
 - type `psql -U userName` in the terminal then enter the password
 - after you log in now you can use postgres commands.
 - `CREATE DATABASE databaseName;` for developing.
 - `CREATE DATABASE databaseName_test;`for testing.
 - you can create users with custom access to databases.
 - `CREATE USER userName WITH PASSWORD 'password`.
 - `GRANT ALL PRIVILAGES ON DATABASE databaseName TO userName`
 - `GRANT ALL PRIVILAGES ON DATABASE databaseName_db TO userName`

4- write the databases you created in the `.env` file  (default port 5432).

5- Install `db-migrate` globally by using `npm i -g db-migrate`.

6- Run `db-migrate up` to run all migration files.

7- Use `npm run start` or `npm run watch` to run the server in watch mode

8- Use `npm run build` to build the app to `dist` folder

9- Use `npm run test` to run the tests files.

10- Use `npm run fmt` to apply eslint rules and format all files.

11- For protected routes, you need to send the token in the authorization header as `Bearer token`

12- The `ENV` variable in the `.env` files can either be `dev` for development or `test` when we 
want to run the tests.

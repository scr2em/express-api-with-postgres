# GETTING STARTED

1- Clone this repo

2- Run `npm install` to install all dependencies.

3- Rename `.env.local` to `.env` and set these variables accordingly.

4- Create the databases you wrote in the `.env` file  (default port 5432).

5- Install `db-migrate` globally by using `npm i -g db-migrate`.

6- Run `db-migrate up` to run all migration files.

7- Use `npm run start` or `npm run watch` to run the server in watch mode

8- Use `npm run build` to build the app to `dist` folder

9- Use `npm run test` to run the tests files.

10- Use `npm run fmt` to apply eslint rules and format all files.

11- For protected routes, you need to send the token in the authorization header as `Bearer token`

12- The `ENV` variable in the `.env` files can either be `dev` for development or `test` when we 
want to run the tests.

This is the backend for the Enve-Allot project.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:8000](http://localhost:8000) to view it in the browser, which should bring up a 404 error message.

This is running nodemon with ts-node.<br />

## In Detail

* Node with express and typescript was used
* No register or login required
* Domain driven approach
* Class oriented separation of concerns 
* Modular, testable architecture
* No ORM, raw SQL is used with PostgreSQL



## Challenges

The backend structure is largely experimental. 

### `Router => Services => Model => Database`

The functionality of the backend is broken up into classes per domain. 'Items' folder in 'src' has everything needed for business logic pertaining to items. The logic is broken down into ItemsRouter, ItemsServices, and ItemsModel classes.

* ItemsRouter takes user input, and calls appropriate ItemsServices methods.

* ItemsServices has methods that import ItemsModel class. The services layer takes care of all non databse logic. For instance, shaping the data that routes receives, or converting dollars into cents so that the model class can use BIGINT datatype to store dollar amounts. 

* ItemsModel exposes database operations, and throws errors since it's the most granular layer. 

Separation of concerns between each layer means we can switch out to a different database without affecting services or routes. The classes export an uninstantiated class which can be called on a mock class for unit testing.

### `Transactions`

The database used is PostgreSQL, and transactions are used where appropriate in order to ensure data consistency. Pooled queries are used where the database driver allowed. Raw SQL was used instead of an ORM for learning purposes.

### `Error Handling`

Due to many layers of logic, errors are handled in a specific way. They are created in the most grandular level, the model. The services class does not create erorrs, or need to pass them, since all functions are ran outside of try/catch blocks. In the router class, errors are passed to centralized error handling middleware, which obfiscates actual error messages from the user, and instead provides human readable error messages.







# Questions Backend

This is a sample API server, I'm going to implement it with different technologies to learn and compare them.

It must do the following:
- CRUD of users
- user authentication
- CRUD of categories, a single object
- CRUD of exams, an object that receive nested object. An examn contains questions, a question contain options
- paginated list
- nested routes, /categories/:id/exams
- performing exam: POST /exams/:id/choices
- custom route name: /users/:id/completed_exams, list of all completed exams of that users
- class types: User has a type Admin or Candidate
- user permissions: Candidate can't see other users
- send email
- socket?

A [Postman](https://www.getpostman.com/) collection v2.1 and a Postman environment are provided inside the `postman` folder with all the expected API. However, since any framework can have its specific default behaviour, instead of changing the backend to adapt to this APIs, inside every project folder I might create a new Postman collection specific to that backend.
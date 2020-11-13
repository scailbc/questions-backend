# Create nested objects

We want to create models that have a relationship between them. Also, we want to create many different object from a single API.

We create 3 objects for an exam:

- **option**: a possible answer for a __question__
- **question**: a single question of an __exam__, a question has different types and it can be an open answer, where the answer is a free text, or can have multiple __options__, where one or more options are correct
- **exam**: an exam contains many __questions__

## Associations

We are using [MySql v8](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html), these relationships are called **association**:

- option **belongs to** question
- question **has many** options
- question **belongs to** exam
- exam **has many** questions

Also, we can say that exam **belongs to** category.

One table (the "belongs to"-side) contains a foreign key to the other table (the "has many"-side). So most relations have both sides.
Since __question belongs to exam__, the `Question` object will have the `exam_id` property.

We could also say that exam **has many** options **through** questions, but we're not going that far.

Since we are using [Sequelize](https://github.com/sequelize/sequelize) as ORM, we need to check its docs about [associations](https://sequelize.org/master/manual/assocs.html).

Basically we have some static functions to define associations.

```js
Exam.belongsTo(Category, {foreignKey: "category"});
Exam.hasMany(Question, {as: "questions", foreignKey: "examId"});
Question.belongsTo(Exam, {foreignKey: "examId"});
```

The problem is that it requires both models, but we are defining models in separate file and we can't have a recursive import.
So we have to define both in a single model.
In my opinion, since the `Questions` table has the `examId` column, it should be defined into the Question model.
But, since the Exam model use the Question model for the queries, we define all in the Exam model.

You can include these associations in the queries:

```js
Exam.findAndCountAll({
    include: {
        model: Question,
        as: "questions",
        attributes: ["id", "text", "type", "answer"],
        include: {
            model: Option,
            as: "options",
            attributes: ["id", "text", "correct"],
        },
    },
    where: hasFilters ? filters : undefined,
    limit: limit,
    offset: offset,
    raw: false, // Get as model to have the questions as an array
})
.then( ({rows, count} ) => {
    return rows;
});
```

## Transactions

We can't insert object into different tables with a single query, we use **transactions**, that make the whole operation atomic. That is, if an error occurs in any object, the whole transaction is reverted and nothing is created.

The transaction is an object passed to all the queries, if there is an error, all the queries that use that transaction will be undone, the database will roollback.

```js
dbConnection.transaction( creationExamTransaction => {
        return Promise.resolve(
            Exam.create({title, category}, {
                transaction: creationExamTransaction,
            })
        )
        .then( createdExam => {
            const newExam = createdExam.toJSON();
            // Create the questions, questions will create the options
            return Promise.all(questions.map( q => {
                return Question.createQuestionWithOptions({...q, examId: newExam.id}, creationExamTransaction);
            }));
        });
    })
    .catch( creationError => {
        // Transaction failed, it will automatically rollback and undo the whole operation
        if (creationError.errors && Array.isArray(creationError.errors)) {
            throw creationError.errors.map( e => e.message );
        }
        else {
            throw creationError;
        }
    })
});
```
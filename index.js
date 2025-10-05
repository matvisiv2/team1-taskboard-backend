const express = require('express');
const usersRouter = require('./routes/users.routes');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use('/api', usersRouter);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

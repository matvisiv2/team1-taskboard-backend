1. You can open and edit schema in
https://app.diagrams.net/

2. Commands to create DB with sequelize-cli:
npx sequelize-cli db:create
npx sequelize-cli db:drop

# create models
npx sequelize-cli model:generate --name user --attributes userType:ENUM,firstName:string,lastName:string,email:string,password:text
npx sequelize-cli model:generate --name board --attributes title:string,userId:integer
npx sequelize-cli model:generate --name collaborator --attributes userId:integer,boardId:integer
npx sequelize-cli model:generate --name column --attributes title:string,boardId:integer
npx sequelize-cli model:generate --name task --attributes title:string,content:string,done:boolean,archived:boolean,columnId:integer
npx sequelize-cli model:generate --name comment --attributes content:string,taskId:integer
npx sequelize-cli model:generate --name label --attributes title:string,color:string,boardId:integer
npx sequelize-cli model:generate --name tasklabel --attributes taskId:integer,labelId:integer

# migration
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all

# test data
# seeders
npx sequelize-cli seed:generate --name user-admin
npx sequelize-cli seed:generate --name board 
npx sequelize-cli seed:generate --name collaborator 
npx sequelize-cli seed:generate --name column
npx sequelize-cli seed:generate --name task
npx sequelize-cli seed:generate --name comment
npx sequelize-cli seed:generate --name label
npx sequelize-cli seed:generate --name tasklabel

# create seeds
npx sequelize-cli db:seed:all
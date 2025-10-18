1. You can open and edit schema in
https://app.diagrams.net/

2. Commands to create DB with sequelize-cli:
npx sequelize-cli db:create
npx sequelize-cli db:drop

# create models
npx sequelize-cli model:generate --name t_user --attributes user_type:ENUM,first_name:string,last_name:string,email:string,password_hash:text
npx sequelize-cli model:generate --name t_board --attributes title:string,user_id:integer
npx sequelize-cli model:generate --name t_collaborator --attributes user_id:integer,board_id:integer
npx sequelize-cli model:generate --name t_column --attributes title:string,board_id:integer
npx sequelize-cli model:generate --name t_task --attributes title:string,content:string,done:boolean,archived:boolean,column_id:integer
npx sequelize-cli model:generate --name t_comment --attributes content:string,task_id:integer
npx sequelize-cli model:generate --name t_label --attributes title:string,color:string,board_id:integer
npx sequelize-cli model:generate --name t_task_label --attributes task_id:integer,label_id:integer

# migration
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all

# test data
npx sequelize-cli seed:generate --name demo-data



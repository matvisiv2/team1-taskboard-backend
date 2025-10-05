
create TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

create TABLE boards(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

create TABLE columns(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    board_id INTEGER,
    FOREIGN KEY (board_id) REFERENCES boards (id)
);

create TABLE tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    column_id INTEGER,
    FOREIGN KEY (column_id) REFERENCES columns (id)
);

create TABLE comments(
    id SERIAL PRIMARY KEY,
    content VARCHAR(255),
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks (id)
);

create TABLE labels(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    color VARCHAR(255)
);

create TABLE tasks_labels(
    task_id INTEGER REFERENCES tasks (id) ON DELETE CASCADE,
    label_id INTEGER REFERENCES labels (id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);
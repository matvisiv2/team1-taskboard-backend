-- ============================
-- 📘  DATABASE SCHEMA: Task Board (Trello-like)
-- ============================

-- 🧑 user
CREATE TABLE tuser (
    id SERIAL PRIMARY KEY,
    userType ENUM ('0', '1', '2') NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📋 board
CREATE TABLE board (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    userId INTEGER NOT NULL REFERENCES tuser (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🧑🧑 collaborator
CREATE TABLE collaborator (
    userId INTEGER NOT NULL REFERENCES tuser (id) ON DELETE CASCADE,
    boardId INTEGER REFERENCES board (id) ON DELETE CASCADE,
    PRIMARY KEY (userId, boardId),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📊 column
CREATE TABLE column (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    boardId INTEGER NOT NULL REFERENCES board (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📝 task
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255),
    done BOOLEAN NOT NULL,
    archived BOOLEAN NOT NULL,
    columnId INTEGER NOT NULL REFERENCES column (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💬 comment
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    taskId INTEGER NOT NULL REFERENCES task (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏷️ label
CREATE TABLE label (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    color VARCHAR(50) NOT NULL
    boardId INTEGER NOT NULL REFERENCES board (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔗 tasklabel (many-to-many)
CREATE TABLE tasklabel (
    taskId INTEGER REFERENCES task (id) ON DELETE CASCADE,
    labelId INTEGER REFERENCES label (id) ON DELETE CASCADE,
    PRIMARY KEY (taskId, labelId),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- ⚙️  INDEXES (for database performance)
-- ============================

CREATE INDEX idxBoardUserId         ON board(userId);
CREATE INDEX idxColumnBoardId       ON column(boardId);
CREATE INDEX idxCollaboratorUserId  ON collaborator(userId);
CREATE INDEX idxCollaboratorBoardId ON collaborator(boardId);
CREATE INDEX idxTaskColumnId        ON task(columnId);
CREATE INDEX idxCommentTaskId       ON comment(taskId);
CREATE INDEX idxTasklabelTaskId     ON tasklabel(taskId);
CREATE INDEX idxTasklabelLabelId    ON tasklabel(labelId);

-- ============================
-- 🕒 OPTIONAL: Trigger for updatedAt auto-update
-- ============================

-- Function that updates updatedAt on UPDATE
CREATE OR REPLACE FUNCTION setUpdatedAt()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables where updatedAt is present
CREATE TRIGGER trgUserUpdatedAt
BEFORE UPDATE ON tuser
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgBoardUpdatedAt
BEFORE UPDATE ON board
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgCollaboratorUpdatedAt
BEFORE UPDATE ON collaborator
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgColumnUpdatedAt
BEFORE UPDATE ON column
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgTaskUpdatedAt
BEFORE UPDATE ON task
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgCommentUpdatedAt
BEFORE UPDATE ON comment
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgLabelUpdatedAt
BEFORE UPDATE ON label
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();

CREATE TRIGGER trgTasklabelUpdatedAt
BEFORE UPDATE ON tasklabel
FOR EACH ROW EXECUTE FUNCTION setUpdatedAt();


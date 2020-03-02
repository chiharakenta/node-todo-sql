CREATE DATABASE node_todo;
CREATE TABLE node_todo.todos(
  id INT NOT NULL AUTO_INCREMENT,
  content VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO node_todo.todos (content) VALUES ('料理'), ('洗濯'), ('勉強');
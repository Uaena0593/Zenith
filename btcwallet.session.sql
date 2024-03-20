-- @block
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- @block 


-- @block
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Uaena_0516';







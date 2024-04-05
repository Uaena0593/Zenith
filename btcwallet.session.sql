-- @block
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- @block
CREATE TABLE portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stock_symbol VARCHAR(10) NOT NULL,
    purchase_date INT NOT NULL,
    shares INT NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);
-- @block
DROP TABLE portfolio;


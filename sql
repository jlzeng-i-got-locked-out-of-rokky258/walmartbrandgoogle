CREATE TABLE words {
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(60) NOT NULL,
    count INT,
    FOREIGN KEY (document) REFERENCES documents(id) 
}

CREATE TABLE documents {
    id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(600) NOT NULL,
    count INT
}

UPDATE words SET count = count + 1  WHERE word = "word"
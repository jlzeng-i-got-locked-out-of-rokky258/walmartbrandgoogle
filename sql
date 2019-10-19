DROP TABLE IF EXISTS documents;
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(600) NOT NULL UNIQUE,
    count INT DEFAULT 0
);

DROP TABLE IF EXISTS words;
CREATE TABLE words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(60) NOT NULL UNIQUE,
    count INT DEFAULT 1,
    document INT, 
    FOREIGN KEY (document) REFERENCES documents(id) 
);

# Create a new document
INSERT INTO documents(url) VALUES({url});

# Update the words table and increase the count on documents
INSERT INTO words(word, document) VALUES({word}, {document}) ON DUPLICATE KEY UPDATE count = count + 1;
UPDATE documents SET count = count + 1 WHERE id={document};
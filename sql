DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS documents;
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(600) NOT NULL UNIQUE,
    desc VARCHAR(280) NOT NULL,
    count INT DEFAULT 0
);


CREATE TABLE words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(60) NOT NULL,
    count INT DEFAULT 1,
    document INT, 
    FOREIGN KEY (document) REFERENCES documents(id) 
);
ALTER TABLE words ADD UNIQUE unique_index (word, document);



# Create a new document
INSERT INTO documents(url) VALUES({url});

# Update the words table and increase the count on documents
INSERT INTO words(word, document) VALUES({word}, {document}) ON DUPLICATE KEY UPDATE count = count + 1;
UPDATE documents SET count = count + 1 WHERE id={document};


# maybe cursed maybe viable TF-idf function
((SELECT count FROM words WHERE word=${word} AND document=(SELECT id FROM document WHERE url=${url})) / (SELECT count FROM document WHERE url=${url})) * LOG( COUNT(SELECT id FROM documents) / COUNT(SELECT word FROM words WHERE word=${word}))



#get all of the documents that contain this word
SELECT DISTINCT document FROM words WHERE word = ${word};
#get the amount of times the word shows up in a certain document
SELECT count FROM words WHERE document = ${document};

# Get a list of documents
SELECT (SELECT url FROM documents WHERE id = words.document) AS url, words.count FROM words WHERE word = ${word};



# We get all the rows associated with a word in the table
SELECT SUM(count) FROM words WHERE word=${word});




# for each document that contains the word, we calculate the TF-idf


# We then sum the tf-idf's of all the words for every document in the list
# Then we sort those.
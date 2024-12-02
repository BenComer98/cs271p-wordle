## Backend 

### Install
Install Python3 and then run 
```
pip3 install -e .
```

Run the flask application
```
run
```


Endpoints
---------

### Hello World

#### Description

A simple endpoint to verify that the service is running.

#### URL

`   GET /   `

#### Method

*   GET
    

#### Responses

*   200 OK: Returns a greeting message.
    

` "Hello World!"   `

### Get Word List

#### Description

Retrieves the complete list of valid 5-letter words used in the Wordle game.

#### URL

`   GET /wordList   `

#### Method

*   GET
    

#### Responses

*   200 OK: Returns the word list as a JSON array.
    

`   json[    "align",    "apple",    "batch",    "crane",    "...",    "zesty"  ]   `

### Get Random Word

#### Description

Returns a random word from the word list. Useful for selecting a target word for the Wordle game.

#### URL

`   GET /randomWord   `

#### Method

*   GET
    

#### Responses

*   200 OK: Returns a JSON object containing a random word.
    

`   json{    "random_word": "crane"  }   `

### Check Word in List

#### Description

Checks if a given word is present in the word list.

#### URL
`   GET /checkWord/<word>   `

#### Parameters

*   : The word to check (URL parameter).
    

#### Method

*   GET
    

#### Responses

*   200 OK: Returns a JSON object indicating whether the word is present.
    
`   json{    "word": "apple",    "is_present": true  }   `

*   400 Bad Request: If no word is provided.
    

`   json{    "error": "No word provided"  }   `

### Solve Wordle CSP

#### Description

Solves the Wordle puzzle using a CSP approach, given an initial guess and the target word. Returns the step-by-step attempts to reach the solution.

#### URL

`   GET /csp/<inital_guess>/<target_word>   `

#### Parameters

*   : The initial guess word (URL parameter).
    
*   : The target word to solve for (URL parameter).
    

#### Method

*   GET
    

#### Responses

*   200 OK: Returns a string detailing each attempt and feedback, concluding with the solution.
    

### Get Best Guess

#### Description

Given a list of previous guesses and the corresponding feedback, suggests the next best word to guess.

#### URL

`   POST /csp/bestGuess   `

#### Request Body

*   JSON object containing:
    
    *   words: A comma-separated string of previous guesses.
        
    *   target\_word: The target word to solve for (used to generate feedback).
        

`   json{    "words": "alert, angle",    "target_word": "apple"  }   `

#### Method

*   POST
    

#### Responses

*   200 OK: Returns a JSON object with the suggested next best guess.
    

`   json{    "best_guess": "apple"  }   `

*   400 Bad Request: If required parameters are missing or invalid.
    

`   json{    "error": "Missing 'words' or 'target_word' parameter"  }   `

`   json{    "error": "'words' must be a comma-separated string"  }   `


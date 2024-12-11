def feedback(guess, target):
    counts = [0] * 26
    feedback = ['gray'] * 5
    
    for i in range(5):
        if guess[i] == target[i]:
            feedback[i] = 'green'
        else:
            counts[ord(target[i]) - ord('A')] += 1
    
    for i in range(5):
        if feedback[i] == 'gray':
            if counts[ord(guess[i]) - ord('A')] > 0:
                feedback[i] = 'yellow'
            counts[ord(guess[i]) - ord('A')] -= 1

    return feedback

# Is the word still legal given the passed in feedback?
def allowed_list(words, guesses, feedbacks, not_found=None, definite=None, not_at=None):
    if not_found is None or definite is None or not_at is None:
        not_found = []
        definite = [None] * 5
        not_at = [[], [], [], [], []]
        contains = []

        for guess, feedback in zip(guesses, feedbacks):
            for i in range(5):
                print("Current check:", guess[i], feedback[i])
                if feedback[i] == 'green':
                    definite[i] = guess[i]
                    if guess[i] not in contains:
                        contains.append(guess[i])

                elif feedback[i] == 'yellow':
                    not_at[i].append(guess[i])
                    if guess[i] not in contains:
                        contains.append(guess[i])

                elif feedback[i] == 'gray' and guess[i] not in not_found:
                    valid = False
                    for j in range(i):
                        if guess[i] in not_at[j]:
                            valid = True
                            break

                    if (not valid):
                        not_found.append(guess[i])

    result_ = []
    for word in words:
        word = word.upper()
        i = 0
        while i < 5:
            if word[i] in not_found or word[i] in not_at[i] or (definite[i] is not None) and (word[i] != definite[i]):
                break
            i += 1

        if i == 5:
            result_.append(word)

    result = []
    for word in result_:
        valid = True
        for required in contains:
            if required not in word:
                valid = False
                break
                
        if valid:
            result.append(word)
            
    return result

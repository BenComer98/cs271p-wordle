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
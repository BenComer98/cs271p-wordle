import random
from WordleEnv import WordleEnv
import numpy as np
import tensorflow as tf

model = tf.keras.models.load_model("wordle_10000_dqn_model.h5")
env = WordleEnv()

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.01),
              loss=tf.keras.losses.MeanSquaredError(),
              metrics=['accuracy'])
# model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.01), loss=tf.keras.losses.MeanSquaredError())


def similarity_score(word_idx, previous_guesses, target):
    word = env.word_list[word_idx]
    overlap_score = sum(len(set(word) & set(guess)) for guess in previous_guesses)
    return overlap_score


def test_model(env, model, target_word=None, start_word=None, max_steps=6):
    state = env.reset(target_word=target_word, start_word=start_word)
    # if target_word:
    #     env.target = target_word.upper()
    # if start_word:
    #     env.current_guess = start_word.upper()
    done = False
    steps = 0
    total_reward = 0
    guesses=[]
    print(f"Testing with target word: {env.target}")

    # while not done and steps < max_steps:
    #     if steps == 0 and start_word:  # Use start_word only for the first step
    #         action = env.word_list.index(start_word.lower())
    #     else
    #     state_input = state.reshape(1, -1)  # Reshape state for the model
    #     q_values = model.predict(state_input, verbose=0)  # Predict Q-values
    #     q_values_filtered = [
    #         (q, i, similarity_score(i, env.guesses, env.target))
    #         for i, q in enumerate(q_values[0]) if i in env.available_actions
    #     ]
    #     q_values_filtered.sort(key=lambda x: (x[0], x[2]), reverse=True)
    #     if not q_values_filtered:
    #         print("No valid actions left!")
    #         break
    #     if np.random.rand() < 0.01:  # Random exploration
    #         action = random.choice(env.available_actions)
    #     else:
    #         valid_actions = [
    #             i for i in env.available_actions
    #             if sum(len(set(env.word_list[i]) & set(guess)) for guess in env.guesses) > 0
    #         ]
    #         if valid_actions:
    #
    #             action = max(valid_actions, key=lambda i: q_values[0][i])  # Best Q-value among valid
    #         else:
    #             action = random.choice(env.available_actions)
    #     if env.current_guess:
    #         action = env.word_list.index(env.current_guess.lower())
    #         env.current_guess = None
    #     next_state, reward, done, _ = env.step(action)
    #     total_reward += reward
    #     steps += 1
    #     guesses.append(env.word_list[action])
    #     print(f"Step {steps}: Guessed '{env.word_list[action]}', Reward: {reward}")
    #
    #     # Update state
    #     state = next_state
    while not done and steps < max_steps:
        # state_input = state.reshape(1, -1)  # Reshape state for the model
        state_input = np.array(state).reshape(1, -1)
        q_values = model.predict(state_input, verbose=0)  # Predict Q-values

        q_values_filtered = [
            (q, i, similarity_score(i, env.guesses, env.target))
            for i, q in enumerate(q_values[0]) if i in env.available_actions
        ]
        q_values_filtered.sort(key=lambda x: (x[0], x[2]), reverse=True)

        if not q_values_filtered:
            print("No valid actions left!")
            break

        if np.random.rand() < 0.01:  # Random exploration
            action = random.choice(env.available_actions)
        else:
            valid_actions = [
                i for i in env.available_actions
                if sum(len(set(env.word_list[i]) & set(guess)) for guess in env.guesses) > 0
            ]
            if valid_actions:
                action = max(valid_actions, key=lambda i: q_values[0][i])  # Best Q-value among valid
            else:
                action = random.choice(env.available_actions)

    next_state, reward, done, _ = env.step(action)
    total_reward += reward
    steps += 1
    guesses.append(env.word_list[action])
    print(f"Step {steps}: Guessed '{env.word_list[action]}', Reward: {reward}")

    # Update state
    state = next_state


    if env.target == env.current_guess:
        print(f"Success! Guessed the word '{env.target}' in {steps} steps.")
    else:
        print(f"Failed to guess the word. Target was '{env.target}'.")
    statuses=[]
    for guess in guesses:
        status=[]
        for i, letter in enumerate(guess):
            if letter == env.target[i]:
                status.append("green")
            elif letter in env.target:
                status.append("yellow")
            else:
                status.append("gray")
        statuses.append(status)

    return guesses, statuses

# guesses,statuses = test_model(env, model, target_word="CHIRP", start_word="SHELL")
guesses,statuses = test_model(env, model)
# print(guesses)
# print(statuses)
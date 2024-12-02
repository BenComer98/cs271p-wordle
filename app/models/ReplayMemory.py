from collections import namedtuple, deque
import random

# Replay memory object for replaying samples from the memory.
# Transition = namedtuple('Transition', ('state', 'action', 'next_state', 'reward','done'))
Transition = namedtuple('Transition', ('prev_state', 'state', 'action', 'reward', 'next_state', 'done'))



class ReplayMemory(object):
    def __init__(self, capacity):
        self.memory = deque([], maxlen=capacity)

    def push(self, *args):
        """Save a transition"""
        self.memory.append(Transition(*args))

    def sample(self, batch_size):
        return random.sample(self.memory, batch_size)

    def __len__(self):
        return len(self.memory)

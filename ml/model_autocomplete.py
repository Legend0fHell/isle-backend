import os
import re
import numpy as np
from collections import Counter

# Load corpus and build frequency counter
with open("big.txt", "r", encoding="utf-8") as f:
    words = re.findall(r'\w+', f.read().lower())
freqs = Counter(words)

# Keep only the most common 10,000 words
most_common_words = [word for word, _ in freqs.most_common(1500)]


# ------------------------ Trie Implementation ------------------------

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        return self._find_words_from_node(node, prefix)

    def _find_words_from_node(self, node, prefix):
        words = []
        if node.is_end_of_word:
            words.append(prefix)
        for char, child_node in node.children.items():
            words.extend(self._find_words_from_node(child_node, prefix + char))
        return words

    def is_word_complete(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

# Create and populate the trie
trie = Trie()
for word in most_common_words:
    trie.insert(word)

# ------------------------ Suggestion Logic ------------------------

def get_suggestions(prefix, trie, freqs, max_suggestions=3):
    """
    Get autocomplete suggestions from the trie based on a prefix.
    Returns the most frequent matches up to max_suggestions.
    """
    suggestions = trie.search(prefix)
    ranked_suggestions = [(word, freqs[word]) for word in suggestions if word in freqs]
    ranked_suggestions.sort(key=lambda x: x[1], reverse=True)
    ranked_suggestions = [word for word, _ in ranked_suggestions]
    return ranked_suggestions[:max_suggestions]

# ------------------------ Model + Prediction ------------------------

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from dotenv import load_dotenv
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

def seed_everything(seed=42):
    """Set random seeds for reproducibility."""
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

# Set seeds and load .env
seed_everything()
load_dotenv()

class AutoCompleteModel:
    def __init__(self, model_name="roneneldan/TinyStories-33M", device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name).to(self.device)
        self.model.eval()

    def predict(self, text, max_new_tokens=2, num_suggestions=7):
        """
        Generate autocomplete suggestions for incomplete or complete last word.
        Returns only alphabetic characters (no numbers, no punctuation).
        """
        text = text.lower().strip()
        text = re.sub(r'[^a-zA-Z\s]', '', text)

        words = text.split()
        if not words:
            return []

        last_word = words[-1]
        if not trie.is_word_complete(last_word):
            # Incomplete word: suggest only the completion
            suggestions = get_suggestions(last_word, trie, freqs)
            if not suggestions:
                return []
            best = suggestions[0]
            completed = best[len(last_word):]
            completed = re.sub(r'[^a-zA-Z]', '', completed)
            return [completed] if completed else []
        else:
            # Complete word: suggest the next word using language model
            prefix = text
            input_ids = self.tokenizer.encode(prefix, return_tensors="pt").to(self.device)
            with torch.no_grad():
                outputs = self.model.generate(
                    input_ids,
                    max_new_tokens=max_new_tokens,
                    do_sample=True,
                    top_k=50,
                    top_p=0.95,
                    temperature=0.5,
                    pad_token_id=self.tokenizer.eos_token_id,
                    num_return_sequences=num_suggestions
                )
            suggestions = []
            for output in outputs:
                decoded = self.tokenizer.decode(output, skip_special_tokens=True)
                suggestion = decoded[len(prefix):].strip()
                next_word = suggestion.split()[0] if suggestion else ""
                next_word = re.sub(r'[^a-zA-Z]', '', next_word)
                if next_word:
                    suggestions.append(next_word)
            return list(dict.fromkeys([" " + s for s in suggestions if s]))


auto_complete_model = AutoCompleteModel()
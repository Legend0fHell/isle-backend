import os

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from dotenv import load_dotenv
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from transformers import GPT2LMHeadModel, GPT2Tokenizer


def seed_everything(seed=42):
    """Set random seeds for reproducibility."""
    torch.manual_seed(seed)           # Set seed for CPU
    np.random.seed(seed)              # Set seed for numpy
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)  # Set seed for all GPUs if available

# Initialize random seeds
seed_everything()

# Load environment variables from a .env file 
load_dotenv()

# Path to the directory or model name containing the LSTM model
load_path = "./lstm_autocomplete_model"


class AutoCompleteModel:

    _instance = None

    def __new__(cls, *args, **kwargs):
        # Ensure only one instance (singleton) of AutoCompleteModel is created
        if cls._instance is None:
            cls._instance = super(AutoCompleteModel, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        # Prevent re-initialization on multiple instantiations
        if self._initialized:
            return

        # Use GPU if available, else fallback to CPU
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Placeholders for model and tokenizer
        self._model = None
        self._tokenizer = None


        self._initialize_model()

        self._initialized = True

    def _initialize_model(self):
        print("Loading LSTM language model...")

        self._tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self._model = GPT2LMHeadModel.from_pretrained("gpt2").to(self.device)
        self._model.eval()  # Set model to evaluation mode

        self._tokenizer.pad_token = self._tokenizer.eos_token

    def predict(self, text: str, num_suggestions: int = 3) -> list[str]:
        """
        Generate autocomplete suggestions for the input text.

        Args:
            text (str): The input text prompt.
            num_suggestions (int): Number of suggestions to generate.

        Returns:
            list[str]: List of suggested next tokens/words.
        """
        # Return a placeholder if input is empty or only whitespace
        if not text.strip():
            return ["<no input>"]

        # Tokenize input text, return PyTorch tensors, pad sequences, and move to correct device
        inputs = self._tokenizer(text, return_tensors="pt", padding=True).to(self.device)
        input_ids = inputs["input_ids"]
        attention_mask = inputs["attention_mask"]

        # Use model.generate() with sampling to get multiple possible continuations
        with torch.no_grad():
            outputs = self._model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_length=input_ids.shape[1] + 10,  # Generate up to 10 tokens beyond input length
                num_return_sequences=num_suggestions,
                do_sample=True,           # Enable sampling for diversity
                top_k=50,                 # Top-K filtering for sampling
                top_p=0.95,               # Top-p (nucleus) filtering for sampling
                temperature=0.8,          # Sampling temperature for creativity
                pad_token_id=self._tokenizer.eos_token_id  # Pad token for generation stopping
            )

        suggestions = []
        for output in outputs:
            # Decode generated token IDs back to string, skip special tokens
            decoded = self._tokenizer.decode(output, skip_special_tokens=True)

            # Extract the newly generated text portion after the original input
            completion = decoded[len(text):].strip()

            # If the completion is non-empty, return the first word as suggestion
            if completion:
                suggestions.append(completion.split()[0])
            else:
                suggestions.append("<none>")  # Placeholder if no completion

        return suggestions


# Create a singleton instance of the model for use
auto_complete_model = AutoCompleteModel()
















import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from dotenv import load_dotenv
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import re
from transformers import AutoModelForCausalLM, AutoTokenizer

def seed_everything(seed=42):
    """Set random seeds for reproducibility."""
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

# Initialize random seeds
seed_everything()

# Load environment variables from a .env file 
load_dotenv()

class AutoCompleteModel:
    def __init__(self, model_name="roneneldan/TinyStories-33M", device=None):
        """
        Initialize the tokenizer and model for TinyStories.

        Args:
            model_name (str): Huggingface model name or path.
            device (str or torch.device): device to run the model on. 
                Defaults to CUDA if available, else CPU.
        """
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")

        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name).to(self.device)
        self.model.eval()

    def predict(self, text, max_new_tokens=10, num_suggestions=5):
        """
        Generate multiple autocomplete suggestions given an input text.

        Args:
            text (str): Input prompt to autocomplete.
            max_new_tokens (int): Max tokens to generate per suggestion.
            num_suggestions (int): Number of suggestions to generate.

        Returns:
            List[str]: Cleaned list of suggested completions.
        """
        input_ids = self.tokenizer.encode(text, return_tensors="pt").to(self.device)

        with torch.no_grad():
            outputs = self.model.generate(
                input_ids,
                max_new_tokens=max_new_tokens,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.4,
                pad_token_id=self.tokenizer.eos_token_id,
                num_return_sequences=num_suggestions
            )

        suggestions = []
        for output in outputs:
            decoded = self.tokenizer.decode(output, skip_special_tokens=True)
            suggestion = decoded[len(text):].strip()
            if suggestion:
                # Keep only alphabetic words
                words = re.findall(r'\b[a-zA-Z]+\b', suggestion)
                if words:
                    suggestion = ' '.join(words)
                else:
                    suggestion = "<none>"
                suggestions.append(suggestion)

        return suggestions


auto_complete = AutoCompleteModel()

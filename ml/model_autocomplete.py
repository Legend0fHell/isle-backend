import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from dotenv import load_dotenv
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from transformers import GPT2LMHeadModel, GPT2Tokenizer


def seed_everything(seed=42):
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

seed_everything()

load_dotenv()

load_path = "./lstm_autocomplete_model"

class AutoCompleteModel:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(AutoCompleteModel, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._model = None
        self._tokenizer = None
        self._initialize_model()
        self._initialized = True

    def _initialize_model(self):
        print("Loading LSTM language model...")

        self._tokenizer = GPT2Tokenizer.from_pretrained(load_path)
        self._model = GPT2LMHeadModel.from_pretrained(load_path).to(self.device)
        self._model.eval()

        # GPT-2 doesn't have pad_token_id by default
        self._tokenizer.pad_token = self._tokenizer.eos_token

    def predict(self, text: str, num_suggestions: int = 3) -> list[str]:
        if not text.strip():
            return ["<no input>"]

        inputs = self._tokenizer(text, return_tensors="pt", padding=True).to(self.device)
        input_ids = inputs["input_ids"]
        attention_mask = inputs["attention_mask"]

        with torch.no_grad():
            outputs = self._model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,  
                max_length=input_ids.shape[1] + 10,
                num_return_sequences=num_suggestions,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.8,
                pad_token_id=self._tokenizer.eos_token_id
            )

        suggestions = []
        for output in outputs:
            decoded = self._tokenizer.decode(output, skip_special_tokens=True)
            completion = decoded[len(text):].strip()
            if completion:
                suggestions.append(completion.split()[0])
            else:
                suggestions.append("<none>")

        return suggestions


auto_complete_model = AutoCompleteModel() 

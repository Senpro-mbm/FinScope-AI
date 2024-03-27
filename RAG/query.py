# -*- coding: utf-8 -*-
"""Senpro OpenAI.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1S_F4aHXufoYgOibEvnmGS06ICsXRku8S
"""



# Basics
import os
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import os


# 1 - Splitter
from langchain.text_splitter import RecursiveCharacterTextSplitter
# 2 - Tokenizer
from transformers import GPT2TokenizerFast

# 3 - Create function to count tokens
tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")

def count_tokens(text: str) -> int:
    return len(tokenizer.encode(text))

# 4 - Define the splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size      = 200,
    chunk_overlap   = 20,
    length_function = count_tokens # It uses len() by default.
)

# 5 - Apply the .split_document command
chunks = text_splitter.split_documents(data[1:30])
print("Multiple PDFs - Now you have {0} number of chunks.".format(len(chunks)))

print(chunks)

# Create a list of token counts
token_counts = [count_tokens(chunk.page_content) for chunk in chunks]

# Create a DataFrame from the token counts
df = pd.DataFrame({'Token Count': token_counts})

# Create a histogram of the token count distribution
df.hist(bins=40, )

# Show the plot
plt.show()

from langchain.vectorstores import FAISS  # for the vector database part -- FAISS is local and temporal, Pinecone is cloud-
from langchain.embeddings.openai import OpenAIEmbeddings

# Get embedding model
embeddings = OpenAIEmbeddings()

from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage

chatgpt = ChatOpenAI(model_name = "gpt-3.5-turbo",
                  temperature=0
                 )

high_level_behavior = """
                       You are an AI bot that help people decide where to travel.
                       Always recommend three destination with a short sentence for each.
                      """

response = chatgpt(
    [
        SystemMessage(content=high_level_behavior),
        AIMessage(content="Hello! I am a traveller assistant, how can I help you?"),
        HumanMessage(content="Where should I travel next?"),
    ]
)

print(response.content)

# 1. Create vector database with FAISS
db_FAISS = FAISS.from_documents(chunks, embeddings)

from langchain.chains.question_answering import load_qa_chain
query = 'Berapa current Asset Perusahaan BRI tahun 2023 ?'
matches = db_FAISS.similarity_search(query, k=4)

chain = load_qa_chain(chatgpt, chain_type="stuff")
chain.run(input_documents=matches, question = query)

"""# Memory & Chaining Activation"""

from langchain.chains.question_answering import load_qa_chain
from langchain.memory import ConversationSummaryMemory
from langchain.chains import ConversationChain

# Initialize language model and memory
chat = ChatOpenAI(model_name = "gpt-3.5-turbo",
                  temperature=0
                 )
memory = ConversationSummaryMemory(llm=chat)

# Initialize conversation chain with memory
summary_chain = ConversationChain(llm=chat, memory=memory, verbose=True)

# Load question answering chain
qa_chain = load_qa_chain(chat, chain_type="stuff")
summary_chain = ConversationChain(llm=chat,memory=memory,verbose=True)


query = 'Can you calculate the Healtiness of BRI Finance in 2023 Based on Available Financial Metrics. Can you Calculate it based on the Information in the Balance Sheet and Profit and Loss Statement. It is okay to not give a comprehensive information, just give us the brief of the financial position of BRI?'
matches = db_FAISS.similarity_search(query, k=4)
qa_chain.run(input_documents=matches, question=query)
from flask import Flask, request, jsonify,Response
from langchain.document_loaders import PyPDFLoader,PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import GPT2TokenizerFast
from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv
from pathlib import Path
import pandas as pd
from langchain.vectorstores import FAISS  # for the vector database part -- FAISS is local and temporal, Pinecone is cloud-
from langchain.embeddings.openai import OpenAIEmbeddings
import json
import os

from api_activation import openai_activate

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv('CLIENT_ORIGIN')]) # permit cors to client app

try:
    path = os.path.dirname(os.path.abspath(__file__))
    upload_folder = os.path.join(path.replace("/file_folder", ""), "tmp")
    os.makedirs(upload_folder, exist_ok=True)
    app.config["upload_folder"] = upload_folder
except Exception as e:
    app.logger.info("An error occurred while creating temp folder")
    app.logger.error("Exception occurred : {}".format(e))


@app.route("/")
def index():
    return Response(
        json.dumps({"status": True, "code": 200, "message": "Its Working!"}),
        mimetype="application/json",
    )



@app.route('/query', methods=['POST'])
def post():
    try:
        # Extract query from request JSON
        query = request.json['query']
        # Rest of your code remains the same
        path = os.path.dirname(os.path.abspath(__file__))
        upload_folder = os.path.join(path.replace("/file_folder", ""), "tmp")
        os.makedirs(upload_folder, exist_ok=True)
        app.config["upload_folder"] = upload_folder
        pdf_file = request.files["file"]
        pdf_name = pdf_file.filename
        save_path = os.path.join("RAG/testing_pdf/", pdf_name)
        pdf_file.save(save_path)
        loader = PyPDFLoader(save_path)
        data = loader.load()
        tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")

        def count_tokens(text: str) -> int:
             return len(tokenizer.encode(text))
        # Define the splitter
        text_splitter = RecursiveCharacterTextSplitter(
             chunk_size      = 200,
             chunk_overlap   = 20,
             length_function = count_tokens # It uses len() by default.
        )
        # Apply the .split_document command

        chunks = text_splitter.split_documents(data[1:30])
        os.environ.get('OPENAI_API_KEY')
        embeddings = OpenAIEmbeddings()
        db_FAISS = FAISS.from_documents(chunks, embeddings)
        matches = db_FAISS.similarity_search(query, k=4)
        qa_chain = load_qa_chain(query, chain_type="stuff")
        queried = qa_chain.run(input_documents=matches, question=query)

        return queried
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": "Failed to upload and process the PDF file"}), 500




if __name__ == '__main__':
    app.run(debug=True)

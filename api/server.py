from dotenv import load_dotenv
load_dotenv()

import json
import os
import pickle

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)

sio = SocketIO(app, cors_allowed_origins='*')

import wsevent

from time import sleep
from threading import Thread
from queue import Queue, Empty
# from functions.pdf_processing import pdfUpload
# from functions.yt_processing import ytUpload

tasks = Queue()

try:
    os.mkdir("runtime_data")
except FileExistsError:
    pass

def loop():
    while True:
        try:
            task = tasks.get_nowait()
            print("New task!")
            task()
        except Empty:
            pass

        sleep(1)

Thread(target=loop, daemon=True).start()

def logInfo(msg):
    print(f"[sid={request.sid}]: {msg}.")

@app.route('/')
def index():
    return "Server is up, please give us A+"

# @app.post('/doc/read')
# def doc_list_read():
#     load_doc_list()
#     global docu_list
#     try:
#         for (i, docu) in enumerate(docu_list):
#             if docu.type == "topic":
#                 if os.path.exists(f"data/{docu.id}.md"):
#                     docu_list[i].processing_status = 1
#                 else:
#                     docu_list[i].processing_status = 0
#             else:
#                 load_docu(docu.id)
#                 docu_list[i].processing_status = docu_cache[docu.id].processing_status
#     except Exception as e:
#         pass
#     return {
#         "msg": "ok",
#         "data": json.loads(json.dumps(docu_list, default=vars))
#     }

# @app.post('/doc/md')
# def doc_md_read():
#     id = request.form.get("id")
#     if os.path.exists(f"data/{id}.md"):
#         with open(f"data/{id}.md", 'r', encoding="utf-8") as fr:
#             outp = fr.read()
#         return {
#             "msg": "ok",
#             "data": outp
#         }
#     else:
#         return {
#             "msg": "err",
#             "data": "no data"
#         }

# def append_docu_task(docu):
#     with open(f"data/doc_list.pkl", 'ab') as fp:
#         pickle.dump(docu, fp)

# def create_docu_task(data):
#     global docu_cache
#     docu_cache[data["id"]] = DocumentModel(data)
    
#     def execute():
#         docu_cache[data["id"]].process()

#     tasks.put(execute)

#     if docu_cache[data["id"]].status == None:
#         append_docu_task(DocumentAbout(data))


# @sio.on("post-prog")
# def check_progress(task_id):
#     load_docu(task_id)
#     emit("get-prog", (task_id, docu_cache[task_id].processing_status))

# @app.post('/upload/<type>')
# def onUpload(type):
#     if type == "pdf":
#         data = pdfUpload(request)
#     elif type == "yt":
#         data = ytUpload(request)
#     if data == None:
#         return "An error occured"

#     create_docu_task(data)
    
#     return {
#         "id": data["id"],
#         "text": data["text"]
#     }


# # ================
@sio.on("connect")
def onConnect():
    emit("get-join", "connected")
    logInfo("connected, test data sent")


@sio.on("disconnect")
def onDisconnect():
    logInfo("disconnected")

if __name__ == '__main__':
    sio.run(app, host="0.0.0.0", port=8000, debug=True)

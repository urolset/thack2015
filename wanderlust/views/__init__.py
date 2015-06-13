from flask import render_template, send_from_directory
from wanderlust import app
import config

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

@app.route('/ng/<path:path>')
def ng_template(path):
    print path
    return render_template(path)

### PUT ROUTES HERE

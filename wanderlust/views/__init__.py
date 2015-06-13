from flask import render_template, send_from_directory
from wanderlust import app
import config

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

@app.route('/ng/<path:path>')
def ng_template(path):
    print path
    return render_template(path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    print "attemping to load ", path
    return render_template('index.html')

### PUT ROUTES HERE

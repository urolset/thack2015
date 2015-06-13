from flask import Flask
import config

app = Flask(__name__, static_folder=config.STATIC_ROOT, template_folder=config.TEMPLATE_ROOT)

import wanderlust.views

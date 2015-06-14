from flask import Flask, render_template, request, make_response, send_from_directory
from wanderlust import app
import destination_finder
import urllib2
import foursquare
import json
import config
import pprint


CLIENT_ID = 'FVM4J3MFYLWHQPNVZDRZHZ5AGL334X5SLDX24CL4INOB504D'
CLIENT_SECRET = 'FWIMXJARQMF3ALB1TUQO0E4411EL01OMYDIETOS0VR55HYJQ'
AMADEUS_API_KEY = 'mjGDldAMY6BtzUfGFeUwvjHdadiGo2rC'


client = foursquare.Foursquare(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)


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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    print "attemping to load ", path
    return render_template('index.html')

### PUT ROUTES HERE

@app.route('/dest_finder/', methods=['POST'])
def dest_finder():
	startDate=request.form['startDate']
	endDate=request.form['endDate']
	theme=request.form['theme']
	budget=request.form['budget']
	return destination_finder.dest_finder(startDate, endDate, theme, budget)


@app.route('/search_venue/', methods=['POST'])
def find_venues():
    location = find_airport_code(request.form['airport_code'])
    query = request.form['triptype']
    budget = request.form['budget']
    x = client.venues.explore(params={'near': location, 'query': query, 'limit': 10, 'price' : budget})
    jsonarray = json.dumps(x)
    return jsonarray

# not working yet
@app.route('/hotel_search/', methods=['POST'])
def find_hotels():
	# location = find_lat_long_code(request.form['airport_code'])
    location = find_city_lat_long(request.form['airport_code'])
    checkin = request.form['check-in']
    checkout = request.form['check-out']
    # amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?' + 'latitude=' + location[0] + '&longitude=' + location[1]
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?' + 'latitude=' + str(location[0]) + '&longitude=' + str(location[1])
    amadeus_string = amadeus_string + '&radius=5' + '&number_of_results=10' + '&check_in=' + checkin + '&check_out=' + checkout
    amadeus_string = amadeus_string + '&apikey=' + AMADEUS_API_KEY
    hotel_results = json.dumps(urllib2.urlopen(amadeus_string))
    return hotel_results


def find_city_lat_long(airport_code):
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/location/' + airport_code + '/?apikey=' + AMADEUS_API_KEY
    json_response = json.load(urllib2.urlopen(amadeus_string))
    latitude = json_response['airports'][0]['location']['latitude']
    longitude = json_response['airports'][0]['location']['longitude']
    return [latitude, longitude]

def find_airport_code(airport_code):
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/location/' + airport_code + '/?apikey=' + AMADEUS_API_KEY
    json_response = json.load(urllib2.urlopen(amadeus_string))
    city_name = json_response['airports'][0]['city_name']
    return city_name
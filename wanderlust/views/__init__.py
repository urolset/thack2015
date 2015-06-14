import urllib2
import json

from flask import Flask, render_template, request, make_response, send_from_directory

import foursquare

import config
from wanderlust import app
import destination_finder


CLIENT_ID = 'FVM4J3MFYLWHQPNVZDRZHZ5AGL334X5SLDX24CL4INOB504D'
CLIENT_SECRET = 'FWIMXJARQMF3ALB1TUQO0E4411EL01OMYDIETOS0VR55HYJQ'
AMADEUS_API_KEY = 'mjGDldAMY6BtzUfGFeUwvjHdadiGo2rC'

client = foursquare.Foursquare(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    print "attemping to load ", path
    return render_template('index.html')

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

@app.route('/ng/<path:path>')
def ng_template(path):
    print path
    return render_template(path)

### PUT ROUTES HERE

@app.route('/dest_finder/', methods=['POST'])
def dest_finder():
    data = request.get_json()
	startDate=data['startDate']
	endDate=data['endDate']
	theme=data['theme']
	budget=data['budget']
	return destination_finder.dest_finder(startDate, endDate, theme, budget)


@app.route('/search_venue/', methods=['POST'])
def find_venues():
    data = request.get_json()
    location = find_airport_code(data['airport_code'])
    query = data['triptype']
    budget = data['budget']
    x = client.venues.explore(params={'near': location, 'query': query, 'limit': 10, 'price' : budget})
    jsonarray = json.dumps(x)
    return jsonarray

# not working yet
@app.route('/hotel_search/', methods=['POST'])
def find_hotels():
	# location = find_lat_long_code(request.form['airport_code'])
    data = request.get_json()
    location = find_city_lat_long(data['airport_code'])
    checkin = data['check-in']
    checkout = data['check-out']
    # amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?' + 'latitude=' + location[0] + '&longitude=' + location[1]
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?' + 'latitude=' + str(location[0]) + '&longitude=' + str(location[1])
    amadeus_string = amadeus_string + '&radius=5' + '&number_of_results=10' + '&check_in=' + checkin + '&check_out=' + checkout
    amadeus_string = amadeus_string + '&apikey=' + AMADEUS_API_KEY
    print(amadeus_string)
    hotel_results = json.dumps(list(urllib2.urlopen(amadeus_string)))
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

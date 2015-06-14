import urllib2
import json


AMADEUS_API_KEY = 'mjGDldAMY6BtzUfGFeUwvjHdadiGo2rC'

def find_airport_code(airport_code):
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/location/' + airport_code + '/?apikey=' + AMADEUS_API_KEY
    json_response = json.load(urllib2.urlopen(amadeus_string))
    city_name = json_response['airports'][0]['city_name']
    return city_name

def find_city_lat_long(airport_code):
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/location/' + airport_code + '/?apikey=' + AMADEUS_API_KEY
    json_response = json.load(urllib2.urlopen(amadeus_string))
    latitude = json_response['airports'][0]['location']['latitude']
    longitude = json_response['airports'][0]['location']['longitude']
    return [latitude, longitude]

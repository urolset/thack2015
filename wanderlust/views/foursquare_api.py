from flask import Flask, request, make_response
import urllib2
import foursquare
import json
import pprint

CLIENT_ID = 'FVM4J3MFYLWHQPNVZDRZHZ5AGL334X5SLDX24CL4INOB504D'
CLIENT_SECRET = 'FWIMXJARQMF3ALB1TUQO0E4411EL01OMYDIETOS0VR55HYJQ'

client = foursquare.Foursquare(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)


def find_venues(airport_code,triptype,budget):
    x = client.venues.explore(params={'near': location, 'query': query, 'limit': 10, 'price' : budget})
    jsonarray = json.dumps(x)
    return jsonarray

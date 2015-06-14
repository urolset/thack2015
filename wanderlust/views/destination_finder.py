from flask.json import jsonify
import urllib2
import datetime
import requests
import json


baseUrl = "https://api.test.sabre.com/v1"
headers = {'Authorization':'Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1'}
AMADEUS_API_KEY = 'mjGDldAMY6BtzUfGFeUwvjHdadiGo2rC'


def find_airport_code(airport_code):
    amadeus_string = 'http://api.sandbox.amadeus.com/v1.2/location/' + airport_code + '/?apikey=' + AMADEUS_API_KEY
    json_response = json.load(urllib2.urlopen(amadeus_string))
    city_name = json_response['airports'][0]['city_name']
    return city_name


def dest_finder(startDate, endDate, theme, budget):
	# start = datetime.datetime.strptime(startDate, "%Y-%m-%d").date()
	# end = datetime.datetime.strptime(endDate, "%Y-%m-%d").date()
	# lengthOfStay = endDate - startDate
	# print lengthOfStay
	origin = "?origin=SFO"
	start = "&departuredate=" + startDate.strftime('%Y-%m-%d')
	end = "&returndate=" + endDate.strftime('%Y-%m-%d')
	theme = "&theme=" + theme
	budget = "&maxFare=budget"
	top = "&topdestinations=5"
	urlAppend = "/shop/flights/fares"
	url = baseUrl + urlAppend + origin + start + end + theme + top

	print 'url: ', url
	#get response back fro Sabre
	response = requests.get(url, headers=headers)
	json_data = json.loads(response.text)
	airportCodes = []
	for result in json_data['FareInfo']:
		IATA_code = result['DestinationLocation']
		result['city'] = find_airport_code(IATA_code)

	return json.dumps(json_data)


def airportCodes_by_theme(input_theme):
	theme = input_theme
	urlAppend = "/lists/supported/shop/themes/"
	url = base_url + urlAppend + theme
	response = requests.get(url, headers=headers)
	json_data = json.loads(response.text)
	jsonlist = json_data['Destinations']
	airportCodes = []
	for l in jsonlist:
		airportCodes.append(l['Destination'])
	return jsonify(airportCodes)



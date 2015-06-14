from flask.json import jsonify
import datetime
import requests
import json 

baseUrl = "https://api.test.sabre.com/v1"
headers = {'Authorization':'Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1'}

def dest_finder(startDate, endDate, theme, budget):
	# start = datetime.datetime.strptime(startDate, "%Y-%m-%d").date()
	# end = datetime.datetime.strptime(endDate, "%Y-%m-%d").date()
	# lengthOfStay = endDate - startDate
	# print lengthOfStay
	origin = "?origin=SFO"
	start = "&departuredate=" + startDate
	end = "&returndate=" + endDate
	theme = "&theme=" + theme
	budget = "&maxFare=budget"
	top = "&topdestinations=5"
	urlAppend = "/shop/flights/fares" 
	url = baseUrl + urlAppend + origin + start + end + theme + top
	response = requests.get(url, headers=headers)
	return response.text

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



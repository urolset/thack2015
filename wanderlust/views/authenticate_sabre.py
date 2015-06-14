import requests
import base64
import json

def encodeBase64(stringToEncode):
    encoded = ""
    encoded = base64.b64encode(stringToEncode)    
    return encoded

key = "V1:helsn5jliccdxdmu:DEVCENTER:EXT"
sharedSecret = "oaKWB77o"

url = "https://api.test.sabre.com/v1/auth/token?="

encodedUserInfo = encodeBase64(key)
encodedPassword = encodeBase64(sharedSecret)
encodedSecurityInfo = encodeBase64(encodedUserInfo + ":" + encodedPassword)
data = {'grant_type':'client_credentials'}
headers = {'content-type': 'application/x-www-form-urlencoded ','Authorization': 'Basic ' + encodedSecurityInfo}

response = requests.post(url, headers=headers, data=data)

print response.text

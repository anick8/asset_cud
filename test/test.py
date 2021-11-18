import requests
import sys

URL = "https://hashx-api-asset-cud.herokuapp.com/createAsset"  #"http://localhost:8080/createAsset"

IdentityUUID = "0ea9ec09c2eefe9d35b17c72b309914c16bc442990e1b44db9cfe3199a33232c"#Unique identity of Asset
CoverContentUUID = "9c22c2130570e8f73dffb76838b6b237ba0ae0dff971d8dc481f92795df1ec40" 	#Unique id of content for cover	
				#URL to fetch assets
Description = "Whats up peeps"				#Description of Asset
ReservePrice= 1				#Reserve price for all assets
# GeolocationUUID = "4564510a416cc7f2a0fd3ca9b81cc7658825802b3d490de276ddbd1bab4f3288"			#UUID of Geolocation table entry
# GeoRadius= 20				#Radius to post in
AssetName= "MyfirstAsset"				# Short display name for Asset


data ={"IdentityUUID":IdentityUUID,"CoverContentUUID":CoverContentUUID,"Description":Description,"ReservePrice":ReservePrice,"AssetName":AssetName}
if len(sys.argv)==4:
	data = {"Username":sys.argv[1],"Email":sys.argv[2] ,"SaltedHash":sys.argv[3]}

r = requests.post(url = URL, data=data)

print(r.text)

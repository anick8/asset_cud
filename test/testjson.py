#!/usr/bin/env python3
#1212
import os,sys,requests,json,time, pprint,csv
from requests.auth import HTTPBasicAuth

def callapi(route,reqvar):
    urlr = route
    print (urlr)
    headers = {'Content-type': 'application/json'}
    reqjson = reqvar
    print(reqjson)
    r = requests.post(urlr, data=json.dumps(reqjson), headers=headers)# auth=HTTPBasicAuth('commandserver', 'cmdserv123')
    print (r.status_code)
    print (r.json())


if __name__ == '__main__':
    #root=sys.argv[1]
    #reqvar=[]
    if(len(sys.argv)==2):
        with open(sys.argv[1]) as f:
            data = json.load(f)
        for y in data: 
            rdata = y["data"]
            route = y["Route"]
            for x in rdata:
                #print(x)
                callapi(route,x)
    else:
         with open(sys.argv[1]) as f:
            data = json.load(f)
         for y in data:
            if(sys.argv[2] in y["Route"]):
                rdata = y["data"]
                route = y["Route"]
                for x in rdata:
                    #print(x)
                    callapi(route,x)


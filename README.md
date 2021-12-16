
# Hashx Asset CUD Microservice
Microservice to implement Asset Create Update and Delete operations.

Run using -

npm install

npm start (OR) node index.js

# Change Guide
Make changes

git add .

git commit -m "Message"

git push hashx 

# Routes

## /createAssetTransaction

Creates a new Asset :

Request Body - 
 - req.body.IdentityUUID : UUID of Identity from Identity 
 - req.body.AssetName  : Name of Asset
 - req.body.CoverContentUUID : UUID of CoverContent from Content
 - req.body.Description : Description of Created Asset
 - req.body.ReservePrice : Price set for the Created Asset
 - req.body.BatchID : Batch number of asset
 - req.body.isPublic : Is public or not, default 1 ( Public
 - req.body.Note : Transaction Note
 - req.body.WalletUUID : WalletUUID of the Wallet
  
Response Body -

res.data ={ReservePrice,TransactionUUID,AssetUUID} 

Query : 
'Insert into "Asset" ("AssetUUID","IdentityUUID","AssetName","CoverContentUUID","CreatedAt","Description","ModifiedAt","ReservePrice","isPublic","BatchID") 

## /updateAssetTransaction

Updates  Asset with new Reserve Price : 

Request Body - 
- req.body.AssetUUID : Unqiue UUID of Asset
- req.body.ReservePrice : New Reserve Price
- req.body.Note : Transaction Note
- req.body.WalletUUID : WalletUUID of the Wallet
- req.body.ToUsername : Username of the Wallet


 
Response Body -

res.data = {ReservePrice,TransactionUUID,AssetUUID} 

 
Query : 
'update "Asset" set "ModifiedAt"=$2,"ReservePrice"=$3 where "AssetUUID" = $1'


## /updateAssetDetails

Updates  Asset metaData  
AssetUUID,Note,ToUsername,TransactionStatus,TransactionType,WalletUUID
Request Body - 
- req.body.AssetUUID : Unqiue UUID of Asset
- req.body.AssetName : Unique Name of Asset
- req.body.CoverContentUUID : UUID of CoverContent from Content
- req.body.Description : Description of Created Asset
- req.body.BatchID : Batch number of asset
- req.body.isPublic : Is public or not, default 1 ( Public )
	
 
Response Body -

res.data = {ModifiedAt} 

 
Query : 
'update "Asset" set "ModifiedAt"=$2,"ReservePrice"=$3 where "AssetUUID" = $1'





## /deleteAssetTransaction

Deletes Asset row : 
Request Body - 
- req.body.AssetUUID : Unqiue UUID of Asset
- req.body.Note : Transaction Note
- req.body.WalletUUID : WalletUUID of the Wallet
- req.body.ToUsername : Username of the Wallet
 

Response Body -

res.data = {ReservePrice,TransactionUUID,AssetUUID} 


Query : 
- 'delete from "Asset" where "AssetUUID"=$1'



# Response Format

[err,data,msg]

 - err : Error message from SQL try block
 - data : Data returned by SQL query
 - msg : Custom message defined in API

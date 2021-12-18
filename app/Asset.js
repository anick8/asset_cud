var pgsql = require('../lib/pgsql')
var hash = require('../lib/hash');
const { range } = require('express/lib/request');

exports.createAssetTransaction = async (req) => {
    try{

        var Timestamp = Date.now()  
        var {Note,WalletUUID} =req.body;
        var TransactionStatus = req.body.TransactionStatus || 1;
        var ToWalletUUID = '7b55fc91931f992fe86b4e4bd27dd33b778e1002146d9f2179ac5c40b9a31321'; //Escrow default wallet
        var ToWalletType = 1;
        var TransactionType = 1;
        var ToUsername = 'Escrow'
        var IdentityUUID = req.body.IdentityUUID;
        var AssetName = req.body.AssetName || "";
        var CoverContentUUID = req.body.CoverContentUUID;
        var Description = req.body.Description|| "";
        var ReservePrice = req.body.ReservePrice|| 0;
        var isPublic = req.body.isPublic|| 1;
        var BatchID =   req.body.BatchID || 0;
        var type = 0
        var From = req.body.From || Timestamp ;
        var Till = req.body.Till ||  2147483647000;  
        var N = req.body.Quantity || 1; 
        console.log(WalletUUID,Timestamp,ReservePrice)
        var AssetListResult =[]
        var TransactionUUID =hash.hashing([WalletUUID,Timestamp])
        var AssetUUID = hash.hashing([AssetName,Timestamp]);
        
        var DebQuery = {
            'qname':'DebitfromWallet',
            'query':'update "Wallet" set "Balance" = "Balance"-$1 where "WalletUUID" = $2;',
            'qarg':[ReservePrice*N,WalletUUID]
        }
        var CredQuery = 

        {
            'qname':'CredittoWallet',
            'query':'update "Wallet" set "Balance" = "Balance"+$1 where "WalletUUID" = $2;',
            'qarg':[ReservePrice*N,ToWalletUUID]
        }

        var CreateTrans = 
        {
            'qname':'createTransaction',
            'query':'insert into "WalletHistory" ("Amount","FromWalletUUID","ToWalletUUID","TransactionUUID","ToWalletType","Timestamp","Note","ToUsername","TransactionStatus","TransactionType") values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
            'qarg':[ReservePrice*N,WalletUUID,ToWalletUUID,TransactionUUID,ToWalletType,Timestamp,Note,ToUsername,TransactionStatus,TransactionType]
        }

  
        

        var queries = [DebQuery,CredQuery,CreateTrans] 
        console.log(queries[0],queries[1],queries[2])
        for (i =0;i<N;i++)
        {   
            var AssetUUID = hash.hashing([AssetName,Timestamp,i])
            AssetListResult.push(AssetUUID)
            var Assetname=`${AssetName} (${i}/${N})`
            var  CreateQuery = {
                'qname':'CreateAsset',
                'query':'Insert into "Asset" ("AssetUUID","IdentityUUID","AssetName","CoverContentUUID","CreatedAt","Description","ModifiedAt","ReservePrice","isPublic","BatchID") values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                'qarg':[AssetUUID,IdentityUUID,Assetname,CoverContentUUID,Timestamp,Description,Timestamp,ReservePrice,isPublic,BatchID]
            }
            var CreateAvail = {
                'qname':'CreateAssetAvailabilty',
                'query':'insert into "Availability" ("ID","type","CreatedAt","ModifiedAt","From","Till") values ($1,$2,$3,$4,$5,$6)',
                'qarg':[AssetUUID,type,Timestamp,Timestamp,From,Till]
            }
            console.log(CreateAvail,CreateQuery)

            queries=queries.concat(CreateQuery)
            queries=queries.concat(CreateAvail)
            
        }

        console.log(queries)

        
        result = await pgsql.executetransaction(queries)
        console.log(result)
        if (('command' in result)){
            if(result.command =='COMMIT')
            {
                data ={'ReservePrice':ReservePrice,"TransactionUUID":TransactionUUID,'AssetUUID':AssetListResult}
                return {'err':null,'data':data,'msg':'Transaction executed'}
            }
        }
        else
        {
            return {'err':null,'data':result,'msg':'Error creating Transaction'}
        }
    }
    catch(error){
        console.log(error)
        return{'err':error,'data':null,'msg':'Error in code transfertokens'}        
    }

}

var getAsset = async(req) => {
    try{

        var {AssetUUID} = req
        qarg =[AssetUUID]
        qname = 'select * from "Asset" where "AssetUUID" = $1'
        result = await pgsql.conquery(qname,qarg)
        console.log(result.rowCount)
        if (result.rowCount == 1)
        {
            data = result.rows[0]
            return {'err':null,'data':data,'msg':"Successfully created Asset"}
        }
        else
        {
            return {'err':null,'data':{err:"Asset not found"},'msg':"Asset not found"}
        }
    }
    catch(err)
        {
            return {'err':err,'data':null,'msg':"Error Getting Asset : "+err.detail}
        }


}


exports.updateAssetTransaction = async (req) => {
    try{

        var Timestamp = Date.now()  
        var {AssetUUID,Note,ToUsername,WalletUUID} =req.body;
        
        var EscrowWalletUUID = '7b55fc91931f992fe86b4e4bd27dd33b778e1002146d9f2179ac5c40b9a31321'; //Escrow default wallet
        var ToWalletType = 1;  //Escrow Wallet
        var ReservePrice = req.body.ReservePrice|| 0;
        var TransactionUUID =hash.hashing([WalletUUID,Timestamp,ReservePrice])
        var TransactionStatus = 1;
        var TransactionType = 1;
        var GARes = await getAsset(req.body)
        if(GARes.data===null || GARes.data.err)
            return GARes    //Return error if failed and halt transaction
        var Reserved = GARes.data.ReservePrice

        var Amount = ReservePrice - Reserved
        console.log(Reserved,Amount,ReservePrice)
        var Sender = Amount>0?WalletUUID:EscrowWalletUUID;
        var Reciever = Amount>0?EscrowWalletUUID:WalletUUID;
        var ToUsername = Amount>0?'Escrow':ToUsername
        //Amount = new price - old price
        // Amount < 0 : Return money
        // Amount > 0 : Charge money
        const queries = [
           {
                'qname':'DebitfromWallet',
                'query':'update "Wallet" set "Balance" = "Balance"-$1 where "WalletUUID" = $2;',
                'qarg':[Amount>0?Amount:-Amount,Sender]
            },
            {
                'qname':'CredittoWallet',
                'qarg':[Amount>0?Amount:-Amount,Reciever],
                'query':'update "Wallet" set "Balance" = "Balance"+$1 where "WalletUUID" = $2;',
            },
            {
                'qname':'createTransaction',
                'query':'insert into "WalletHistory" ("Amount","FromWalletUUID","ToWalletUUID","TransactionUUID","ToWalletType","Timestamp","Note","ToUsername","TransactionStatus","TransactionType") values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                'qarg':[Amount,Sender,Reciever,TransactionUUID,ToWalletType,Timestamp,Note,ToUsername,TransactionStatus,TransactionType]
            },
            {
                'qname':'updateAsset',
                'query':'update "Asset" set "ModifiedAt"=$2,"ReservePrice"=$3 where "AssetUUID" = $1',
                'qarg':[AssetUUID,Timestamp,ReservePrice]
            }
        ]
        console.log(queries[0].qarg)
        console.log(queries[1].qarg)
        console.log(queries[2].qarg)
        console.log(queries[3].qarg)
        result = await pgsql.executetransaction(queries)
        console.log(result)
        if (('command' in result)){
            if(result.command =='COMMIT')
            {
                data ={'ReservePrice':ReservePrice,"TransactionUUID":TransactionUUID,'AssetUUID':AssetUUID}
                return {'err':null,'data':data,'msg':'Transaction executed'}
            }
        }
        else
        {
            return {'err':null,'data':result,'msg':'Error creating Transaction'}
        }
    }
    catch(error){
        console.log(error)
        return{'err':error,'data':null,'msg':'Error in code transfertokens'}        
    }

}

               

exports.updateAssetDetails = async (req) => {
    var AssetUUID = req.body.AssetUUID;
    var AssetName = req.body.AssetName;
    var CoverContentUUID = req.body.CoverContentUUID;
    var ModifiedAt = Date.now();
    var Description = req.body.Description;
    var isPublic = req.body.isPublic|| 1;
    var BatchID =   req.body.BatchID || 0;
    var qarg=[AssetUUID,AssetName,CoverContentUUID,Description,ModifiedAt,isPublic,BatchID];
        qname='update "Asset" set "AssetName"=$2,"CoverContentUUID"=$3,"Description"=$4,"ModifiedAt"=$5,"isPublic"=$6,"BatchID"=$7 where "AssetUUID" = $1'
    try{
        result =await pgsql.conquery(qname,qarg)
        console.log(result.rowCount)
        if (result.rowCount == 1)
        {
            data ={"ModifiedAt":ModifiedAt}
            return [null,data,"Successfully updated Asset"]
        }
        else if(result.rowCount == 0){
            data ={"err":"AssetUUID does not exist"}
            return [null,data,"AssetUUID does not exist"]
        }
    }
    catch(err)
    {
        return [err,null,"Error updating Asset to the database :"+err.detail]
    }

};






exports.deleteAssetTransaction = async (req) => {
    try{

        var Timestamp = Date.now()  
        var {AssetUUID,Note,ToUsername,WalletUUID} =req.body;
        var TransactionType = req.body.TransactionType || 2;
        var TransactionStatus = req.body.TransactionStatus || 2;
        var ToWalletUUID = '7b55fc91931f992fe86b4e4bd27dd33b778e1002146d9f2179ac5c40b9a31321'; //Escrow default wallet
        var ToWalletType = 2;  //Escrow Wallet
        var TransactionUUID =hash.hashing([WalletUUID,Timestamp])

        var GARes = await getAsset(req.body)
        if(GARes.data===null || GARes.data.err)
            return GARes    //Return error if failed and halt transaction
        var Reserved = GARes.data.ReservePrice
        console.log(Reserved)
        const queries = [
           {
                'qname':'DebitfromWallet',
                'query':'update "Wallet" set "Balance" = "Balance"-$1 where "WalletUUID" = $2;',
                'qarg':[Reserved,ToWalletUUID]
            },
            {
                'qname':'CredittoWallet',
                'qarg':[Reserved,WalletUUID],
                'query':'update "Wallet" set "Balance" = "Balance"+$1 where "WalletUUID" = $2;',
            },
            {
                'qname':'createTransaction',
                'query':'insert into "WalletHistory" ("Amount","FromWalletUUID","ToWalletUUID","TransactionUUID","ToWalletType","Timestamp","Note","ToUsername","TransactionStatus","TransactionType") values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                'qarg':[Reserved,WalletUUID,ToWalletUUID,TransactionUUID,ToWalletType,Timestamp,Note,ToUsername,TransactionStatus,TransactionType]
            },
            {
                'qname':'deleteAsset',
                'query':'delete from "Asset" where "AssetUUID"= $1',
                'qarg':[AssetUUID]
            },
            {
                'qname':'deleteAssetAvailabilty',
                'query':'delete from "Availability" where "ID"= $1',
                'qarg':[AssetUUID]
            }
        ]
        console.log(queries[0].qarg)
        console.log(queries[1].qarg)
        console.log(queries[2].qarg)
        console.log(queries[3].qarg)
        result = await pgsql.executetransaction(queries)
        console.log(result)
        if (('command' in result)){
            if(result.command =='COMMIT')
            {
                data ={'ReservePriceCredited':Reserved,"TransactionUUID":TransactionUUID,'AssetUUID':AssetUUID}
                return {'err':null,'data':data,'msg':'Transaction executed'}
            }
        }
        else
        {
            return {'err':null,'data':result,'msg':'Error creating Transaction'}
        }
    }
    catch(error){
        console.log(error)
        return{'err':error,'data':null,'msg':'Error in code transfertokens'}        
    }

}




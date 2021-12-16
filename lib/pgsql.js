var pg = require('pg');
var config = {
   //user: 'vzcexrgllbfpwg',
   //host:'ec2-52-0-93-3.compute-1.amazonaws.com',
   //password: '1a6b31281e49b445b1c19e2fa23dc2ea345e7da7211d4b16a7a2a5215acf227b',
   //database: 'd1mssicitt3s3vi',
   //port:5432,
   connectionString:'postgres://vzcexrgllbfpwg:1a6b31281e49b445b1c19e2fa23dc2ea345e7da7211d4b16a7a2a5215acf227b@ec2-52-0-93-3.compute-1.amazonaws.com:5432/d1mssicitt3s3v',
   ssl: { rejectUnauthorized: false }
}
const pool = new pg.Pool(config)
var getpgcontran = async (qname,qargs) => {
   const client = await pool.connect() 
   try
   {
      return result = await client.query(qname,qargs)
      }
   catch(e){
      console.log(e)
      throw e  
   }
   finally{
      client.release()
      console.log("Connection closed")
   }
};

//make a postgres transanction
var executetransaction = async(queries) => {
   var rollback = async(client,response) => {
   try{
      await client.query('ROLLBACK');
      client.release()
      console.log('RolledBack')
      return response
   }
   catch(error){
      return error
      }
   }
   var commit = async(client,response) => {
      try{
         var responseC = await client.query('COMMIT');
         client.release();
         console.log('Commited')
         return responseC
      }
      catch(error){
         return error
         }
   }
   try{
      var client = await pool.connect();
      console.log('connected')
      }
   catch(error){
         console.log('error ocurred while trying to connect',error)
         return error
      }
   try{
      await client.query('BEGIN');
      let qlen = queries.length;
      for( qry of queries){                 //Traverse Through the list of queries sequentially and execute them
               var response = await client.query(qry['query'],qry['qarg']);
               if(response.rowCount == 0)   //If query has not returned rowcount break from the loop and Roll back
               {  
                  response = {'err':`Could not execute query ${qry['qarg']}`}
                  var responseRB = await rollback(client,response);
                  return responseRB    
               }
               else qlen--;
            
      }
      if(qlen == 0){ //If all the queries executed successfully commit
         var responseC = await commit(client,response)
         return responseC
      }  
   }
   catch(error){
      var responseRB = await rollback(client,error);
      return responseRB            
   }
}

exports.connection = config;
exports.conquery = getpgcontran;
exports.executetransaction =executetransaction


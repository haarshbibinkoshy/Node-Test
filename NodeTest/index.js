
import express from "express";
import csv from "csv-parser";
import axios from "axios";
import Table from "cli-table3";
import stripBom from "strip-bom-stream";
// import fs from "fs";
import {createObjectCsvWriter} from "csv-writer";

const app = express();


//added for testing
app.get(`/`, (req, res, next) => {
  res.json({ message: `working!!` });
});

//function to fetch csv files
async function getCsv(urls) {
  let results=[]

    for (const url of urls) {
      const response = await axios({
          method: "get",
          url: url,
          responseType: "stream",
        });
      const data = await new Promise((resolve, reject) => {
        const results = [];
        response.data
        .pipe(stripBom())
        .pipe(csv({ separator: ";" }))
          .on('data', (data) => {
            if (url.includes('magazines')) {
              data.type='magazine'
          }else
          if (url.includes('books')) {
              data.type='book'
          }
            results.push(data)})
          .on('end', () => resolve(results))
          .on('error', reject);
      });
      results.push(...data);
    }

  return results
} 
//print all csv
app.get('/printAll',async(req,res) => {
  let table = new Table({

      head: ["title", "isbn", "authors","publishedAt","description","type"]

    });
  let urls = [
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv",
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv",
  ];

  let resp=await getCsv(urls)
      resp.map(data=>{
      // console.table(data)
        table.push([data.title.substring(0, 20), data.isbn, data.authors.substring(0, 20),data.publishedAt,data.description?.substring(0, 20),data.type]);
      })
      // res.json(results);
      console.log(`Print All:`);
  console.log(table.toString());
  res.send(resp);
})
//download all csv
app.get('/printAllIntoCSV',async(req,res) => {
  let table = new Table({
  
      head: ["title", "isbn", "authors","publishedAt","description","type"]

    });
  let urls = [
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv",
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv",
  ];

  let resp=await getCsv(urls)
      resp.map(data=>{
      // console.table(data)
        table.push([data.title.substring(0, 20), data.isbn, data.authors.substring(0, 20),data.publishedAt,data.description?.substring(0, 20),data.type]);
      })
      // res.json(results);
      let results=[]
for(let i=0;i<resp.length;i++){
  let obj={}
  obj.title=resp[i].title?resp[i].title:''
  obj.isbn=resp[i].isbn?resp[i].isbn:''
  obj.authors=resp[i].authors?resp[i].authors:''
  obj.publishedAt=resp[i].publishedAt?resp[i].publishedAt:''
  obj.description=resp[i].description?resp[i].description:''
  obj.type=resp[i].type?resp[i].type:''
  // if (resp[i].title) {
    
  // }
  results.push(obj)
}
// console.log(results);
const csvWriter = createObjectCsvWriter({
  path: 'file.csv',
  header: [
      {id: 'title', title: 'title'},
      {id: 'isbn', title: 'isbn'},
      {id: 'authors', title: 'authors'},
      {id: 'publishedAt', title: 'publishedAt'},
      {id: 'description', title: 'description'},
      {id: 'type', title: 'type'},
  ]
});


let csvResp= await csvWriter.writeRecords(resp)       // returns a promise
  .then(() => {
      console.log('...Done');
  });

  
  res.download('file.csv')
  // res.send(results);
})
//find by author email
app.get('/findByAuthor',async(req,res) => {
  let table = new Table({

      head: ["title", "isbn", "authors","publishedAt","description","type"]

    });
  let urls = [
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv",
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv",
  ];

  let resp=await getCsv(urls)

console.log(req.query);
    let result=  resp.filter((e)=>{   return e.authors.includes(req.query.authors) })
    console.log(result);
    if (result!==undefined) {
      result.map(data=>{
        // console.table(data)
          table.push([data.title.substring(0, 20), data.isbn, data.authors.substring(0, 20),data.publishedAt,data.description?.substring(0, 20),data.type]);
        })
        console.log(`Find By Authors:`);
      console.log(table.toString());
     
    }else{
      // res.send("not found");
      result="not found";
    }
      // res.json(results);
      res.json(result);

})
//find by ISBN
app.get('/findByISBN',async(req,res) => {
  let table = new Table({
      head: ["title", "isbn", "authors","publishedAt","description","type"]

    });
  let urls = [
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv",
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv",
  ];

  let resp=await getCsv(urls)
  
console.log(req.query);
    let result=  resp.find(({isbn})=>isbn==req.query.isbn)
    // console.log(result);
    if (result!==undefined) {
    
      table.push([result.title.substring(0, 20), result.isbn, result.authors.substring(0, 20),result.publishedAt,result.description?.substring(0, 20),result.type]);
      console.log(`Find By ISBN:`);
      console.log(table.toString());
     
    }else{
      // res.send("not found");
      result="not found";
    }
      // res.json(results);
      res.json(result);

})
//sort by title
app.get('/sortByTitle',async(req,res) => {
  let table = new Table({

      head: ["title", "isbn", "authors","publishedAt","description","type"]

    });
  let urls = [
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv",
    "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv",
  ];

  let resp=await getCsv(urls)
  
console.log(req.query);
    let result=  resp.sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
    
      if (titleA < titleB) {
        return -1;
      }
    
      if (titleA > titleB) {
        return 1;
      }
    
      return 0;
    })
    console.log(result);
    if (result!==undefined) {
      result.map(data=>{
        // console.table(data)
          table.push([data.title.substring(0, 20), data.isbn, data.authors.substring(0, 20),data.publishedAt,data.description?.substring(0, 20),data.type]);
        })
        console.log(`Sorted By Title:`);
      console.log(table.toString());
     
    }else{
      // res.send("not found");
      result="not found";
    }
      // res.json(results);
      res.json(result);

})



app.listen(4000, () => {
  console.log(`listening at 4000!!!`);
});

  
Project Name : SalesVision   

## Screenshots:
![image](https://github.com/sarthakChauhan12/salesVision/assets/104530435/9859150c-7f3f-4760-bd5e-84707116d151)
![image](https://github.com/sarthakChauhan12/salesVision/assets/104530435/f75ce73d-ef76-44d9-9f2e-9910970b547c)
![image](https://github.com/sarthakChauhan12/salesVision/assets/104530435/95ed2d9c-45f1-4a6e-af1b-d184e715da6d)


Installation Instructions  
--
(For python backend to run, download code runner and ensure you have these libraries installed. Run the python backend using coderunner)   
```pip install flask os pickle pymongo datetime pandas statsmodels flask_cors prophet```    

(For node backend, either setup a cloud mongodb and change URI accordingly or download mongodb community server as it currently runs on local community server)  
Install the following, `npm i bcrpytjs express cors body-parser mongoose nodemon`  
`nodemon index.js` or `node index.js` to run  

(For frontend)  
`npm i `  
`npm start  `

## Additional Info  
--
Dashboard will crash as there is no data initially, for that once logged in change URL to http://localhost:3000/graphsPanel  
and upload an excel file (as per the format one column, first row = category name, second row = region/continent name, all other rows = sales data)  

## READ (Known Issues)  

Do not upload the same file twice (same name)  
Do not click on file upload from Dashboard route, only upload files from "File Upload" that is /graphsPanel route  

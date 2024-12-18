# Receipt Processor

## Overview

Thanks for viewing my project. 

This is a fully functioning receipt processor API.

It has two routes:

1. **POST `/receipts/process`**
   - Saves a receipt in local memory.
   - Gives it a unique ID.
   - Returns that ID.

2. **GET `/receipts/{id}/points`**
   - Retrieves the total points a receipt has earned.

## **to run the application**

1. Docker must be installed
2. Run `docker build -t receipt-processor .` to build the docker image
3. Run the docker container with `docker run -p 3000:3000 receipt-processor`, (alternatively, choose your own ports.) 
4. The API should now be available at localhost:3000, send your receipts thataway!
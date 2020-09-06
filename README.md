# WonderQ
Wonder Q is a simple queue server, it receives messages that are kept
until they are polled and processed.

# Setup

After cloning the repo, install the packages and you can start the application.

The app supports a .env file in the root for environment variables. But those can also be set up exporting them.

Wonder Q supports the following variables.

| Variable | Description |
| --- | --- |
| PORT | Port in which the server will be run defaults to 8080 |
| MAX_TIME_TO_PROCESS | How much a time a message is locked after being polled in milliseconds, defaults to 60000 |
| INTERVAL_BETWEEN_CHECKS | How often we check if any single message has exceeded the maximum time to process in milliseconds, defaults to 10000|


### Endpoints

### **Publish** Endpoint

Publish an element that will be sent along with the id to anyone polling the messages from the queue

* **URL**

  /publish

* **Method:**

    `POST`

* **Headers**

   `Content-Type: application/json` - The content type must be set to application/json.

* **Request Body**

   **Required:**

    `payload`: Object element for the message

    ```json
    {
        "payload": "Object"
    }
    ```

* **Success Response:**


  * **Code:** 200
  * **Content:** The generated id for the message as a string


* **Error Response:**
  * **Code:** 400 Bad Request <br />
    **Content:** `{error: 'Payload was not found'}`


### **Poll** Endpoint

Obtains all the messages available at the moment in the queue.
Locks those messages until they are processed until they are processed
by the process endpoint or until the configured maximum time to process
have passed.

* **URL**

  /poll

* **Method:**

 `GET`

* **Success Response:**


  * **Code:** 200 <br />
    **Content:**
   ```javascript
    [
      {
          "id": "string",
          "payload": "Object"
      }
    ]
   ```


### **Process** Endpoint

Process a single message using the provided id and remove it from the queue.
Can only process locked messages.

* **URL**

  /process/:id

* **Method:**

 `POST`

*  **URL Params**

   **Required:**

      `id=[string]`: the id of the message

* **Success Response:**


  * **Code:** 204 <br />
    **Content:** No content

* **Error Response:**
    * **Code:** 400 Bad Request <br />
      **Content:** `{error: 'Id is required to process'}`

    * **Code:** 404 Not Found <br />
      **Content:** `{error: 'A message locked with the provided id was not found'}`

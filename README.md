# Chatty

### The goal
Provide a safe and commitment-free way of communicating.

### The web stack
- Elixir(Phoenix)
- AngularJS(The whole frontend)
- Postgres
- Ngnix

### How is the stack coming together?
- The angular app talks to the web server via API calls that are authenticated ([see](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/authkey_interceptor.js)) via user token. 
- The web server defines API endpoints that respond to JSON requests and the angular app talks to Phoenix channels via WebSockets.
- Why two applications? 
  - The backend as API server and the frontend being the angular app.
  - The goal of the project was to creat modular components such that tasks are easy to divide tasks. The UI has quite a bit of DOM    manipulation and using jQuery would not suffice.
- The angular app lives [here](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/tree/master/assets/js/app).


### What features are accomplished?
- User authentication via login and user tokens(used by the angular app).
- End-to-end encryption for messages exchanged between members.
- Room creation logic.
- Basic friend relationship.
- Emoji.
- Room theme color.
- Encrypted file sharing.
- Option to completely turn off encryption.
- Live updates. If an owner changes the theme colour, changes are applied to all connected clients.

### Understanding how encryption was done.
The whole encryption occurs on the browser. Leverage Web Crypto API by building [a wrapper](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/services/users_crypto_manager.js) around it.
1. Every time a user enters a room, asymmetric keys are created (public and private keys are issued). 
2. The public key is broadcasted to every member in that room, for some of the logic see [this file](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/rooms/room_manager.js).
3. Once the user A receive user's B public key, user A saves B's public key.
4. User A is going to use B's public key to talk to B. Once B receives a message from A, it can then read the message using its private key. 
The implication of this model is that when a user A is sending messages into a room with user C, E, D. A is sending three different messages. One for each member, since A needs to encrypt the message for each user.

### Understanding how encrypted file sharing was done.
For file sharing, we use our own wrapper around the Web Crypto API as explained above. 
We chunk files into 200 bytes length because the message length constraint is imposed by the algorithm we have chosen. 
Each chunk is then encrypted just like a normal message and send to each user in the room. As users receive each chunk, they decrypt the chunk and save. 
Once users receive all chunks, the decrypted chunks are combined and the file is restored.
See [here](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/rooms/room_manager.js#L200) and [here](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/services/file_manager.js).

### Why are they done this way?
The whole structure to support saving messages has been laid out but to be **commitment-free** it does not save the messages.

### Limitations & Possible solutions
Messages are encrypted via RSA algorithm, there is a limit in the size of the message we can encrypt with the RSA algorithm, that means long messages cannot be sent at the moment. The solution could be to either look for a different algorithm or do message chunking (what we did with file sharing).


To run via vagrant:

`vagrant up`
This will boot the vm and run the server in the same terminal.
The app should be accessible at http://localhost:4289/.

username: testuser@example.com
password: secret

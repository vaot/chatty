# Chatty

### The goal
Provide a safe and commitment-free way of communicating.

### The web stack
- Elixir(Phoenix)
- AngularJS(The whole frontend)
- Posgres
- Ngnix

### How is our stack coming together ?
We have our angular app talking to our web server via API calls that are
authenticated ([see](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/authkey_interceptor.js)) via
an user token. Our web server define API end points that respond to json requests.
Also, our angular app talks to phoenix channels via websockets.
Why have we basically created two apps ? the backend as API server and the frontend being the angular app ?
First, we wanted development to be modular and easy to divide tasks. Second, our ui has quite a bit
of DOM manipulation and just using jQuery would not do it. Last, it is the proper way these days anyway :).
The angular app lives [here](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/tree/master/assets/js/app).


### What features have we accomplished ?
- User authentication via login as well as user tokens(used by angular app).
- End-to-end encryption for messages exchanged between members.
- Room creation logic
- Basic friend relationship
- Emoji
- Room theme color
- Encryped file sharing
- Option to completely turn off encrytion
- Live updates. If an owner changes the theme colour, changes are applied to all
connected clients.

### Understanding how encryption was done.
The whole encryption occurs on the browser, we leverage Web Crypto Api by
building [a wrapper](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/services/users_crypto_manager.js) around it.
Every time a user enters a room, asymmetric keys are created, in other words,
public and private keys are issued. The public key is then broadcasted to evey member
in that room, for some of the logic see [this file](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/rooms/room_manager.js).
Once an user A receive user's B public key, user A saves B's public key.
User A is going to use B's public key to talk to B. Once B receives a message
from A, it can then read the message using its private key. The implication of
this model is that when an user A is sending messages into a room with user C, E, D,
A is basically sending 3 different messages. One for each member, since A needs to
encrypt the message for each user.

### Understanding how encrypted file sharing was done.
For file sharing, we use our own wrapper around the web crypto api as explained above.
We chunk files into 200 bytes length because of the message length constraint 
that is imposed by the algorithm we have chosen. Each chunk is then encrypted
just like a normal message and sent to each user in the room. As users receive
each chunk, they decrypt that chunk and save them. Once users
receive all chunks, the decrytped chunks are combined and the file is restored.
See [here](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/rooms/room_manager.js#L200) and [here](https://csil-git1.cs.surrey.sfu.ca/vaolivei/demo-site/blob/master/assets/js/app/services/file_manager.js).

### Why some of things are done this way ?
We have deliberately chosen not to save messages in favour of the commitment to
be commitment-free. In fact, the whole structure to support saving messages are
already laid out, we just have chosen not to.

### Limitations & Possible solutions
Messages are encrypted via RSA algorithm, with such algorithm there is
a limit in the size of the message we can encrypt, that means that long
messages cannot be sent at the moment. The solution could be to either look
for a different algorithm or do message chunking(what we did with file sharing).


### Testing the app
We make heavily use of modern browser technologies, such as:
- Web Crypto Api for encryption
- URL api for file sharing
- Flexbox for layout

We have fully tested it on Chrome browser and latest firefox.

### How to run the app & Deployment on AWS
There are two ways you can see this app in action, the easiest is to visit 

https://us-east.aurorapool.io/. 

The app is deployed on AWS using a docker compose
setup(see docker files in the repo for more info).


To run via vagrant:

`vagrant up`
This will boot the vm and run the server in the same terminal.
The app should be accessible at http://localhost:4289/.

username: testuser@example.com
password: secret

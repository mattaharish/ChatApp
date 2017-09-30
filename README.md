# ChatApp
#### A web-based chatting application developed using Node JS, Mongo, Socket.io, EJS. 

### Application Description:
1. Login and signup module using bcrypt(password hashing) and sessions.
2. Logged In user can see all the users who have already created account.
3. An "online" note is displayed at the end of the name tab for the users who are actively using the application.
4. On selecting the user to chat by clicking on any of the available names, will be redirected to chat page, where all the previous conversation is displayed. 
5. When user is typing, other user is notified with "typing.."(Like WhatsApp)
6. If user logged, everyone who is actie will be notified.

### Project Requirements:
- Node JS
- Mongodb
- Socket.IO
- Express JS

### Run the applictaion:

* Clone the project into the local-system.
* Go to the folder where the project is cloned.
* Open cmd and type npm install.
* Make sure you run the mongodb.
* Type "node app.js" to run the application.
* Open the browser and type "localhost:8000"

### Using the Application:

- After opening the URL, a sigup-login page will be rendered.
- If you are new-user click on "Register" and enter Name, email, password fields and click on submit.
- On clikcing the submit button, a new account is created and a flash-message "You can login now" will be appeared.
- After logging in with the valid credentials you can see all the users.
- If any user is online at that time you logged in, you will be seeing a note "Online" at the end of the name tab.
- On clicking any of the names available, you will be rediredted to chat page(where the header of the chatbox containing the name of user with whom we are chatting)
- Previous conversations with that user(If any) will be loaded on entering to the chatbox page.
- If two users are online and start texting each-other, you can see "typing.." quote just below the name of the user(like in whatsapp).
- While chatting, if user goes back to previous page or logged out, a notification "<username> is offline" will be appeared at top of chatbox.

### Deployment:

- Application is deployed into AWS cloud.
- Application is running on "Ubuntu 16.04".
- Web-Server: Nginx
- Database is hosted in "mLab"(Database Service Provider).

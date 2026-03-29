Authentication : it is a process using which we can uniquely identify user on our application. This process tells as about who the user is. The general signup/login/logout flow is used to authentication a user. 

Authorisation : it is a process using which we can identify the capability of a user, i.e what a user can do on out application.

Authentication :- mobile no., email, token based authentication (JWT)

JWT -> json web token. 

To generate the JWT token, we actually use the client/user credential. Hence no need to save the token in server.



RBAC(Role-Based Access Control) :-> We’re basically deciding who can do what in your system

Role = ADMIN, MANAGER, USER

A admin can only change the role of the user. ex. from USER -> ADMIN 
when the role of a user is changed we delete the refreshtoken from db now after his accesstoken(short-lived) expired user need to again login and then can  access all the changed role. 
(if needed we can use tokenversioning but it need db call on each auth -- currently i am not doing that)


Used cron-job to schedule the deletion of expired tokens from db (like every 12hr) { If the refresh tokens are in millions then indexing will help to reduce time in searching for expired tokens (improve more than 10times)} {can use partition too} { can use rotation of refresh token while creating new access token}



support login through google and github 


TODO :- if a user login through github/google but then logic through local than we need to manage password and one user should have one account and can logic through diffrent platform 
 
Authentication : it is a process using which we can uniquely identify user on our application. This process tells as about who the user is. The general signup/login/logout flow is used to authentication a user. 

Authorisation : it is a process using which we can identify the capability of a user, i.e what a user can do on out application.

Authentication :- mobile no., email, token based authentication (JWT)

JWT -> json web token. 

To generate the JWT token, we actually use the client/user credential. Hence no need to save the token in server.



RBAC(Role-Based Access Control) :-> We’re basically deciding who can do what in your system

id   Role
1 -  Admin
2 -  Manager
3 -  Customer

await u1.hasRoles(1) return boolean of is Customer u1 is admin or not
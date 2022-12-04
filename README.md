This is a self learning project meant for learning a user authentication approach using Auth Guard components and React Context to deisgn an extensible user authentication system for NextJS applications.

## Getting Started

First, install the dependencies using:

`pnpm install`

Then, run the server in development mode:

`pnpm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to experiement with the project.

## User Accounts

Use the following accounts to test the project

### Admin Account

`Username`: admin\
`Password`: admin123

### User Account

`Username`: joe\
`Password`: joemama

## Auth Guards

The following is the explanation of each auth guard

### GuestGuard

`GuestGuard` is the guard to check if user is logged in or not.\
In the current design, we go with a `boolean` approach for its value and thus it only support strictly `guest` or `user`.

In the case, you would like to expand for allowing `both`, then you can redesign the values it take and added validation for these different conditions.

### AuthGuard

`AuthGuard` is being called if user is being directed a non-guest page. The `AuthGuard` will then be rendered instead of the `GuestGuard`, which will do a redirect to the `/login` route to prompt user to login.

### AclGuard

`AclGuard` is utilized to check if users are permitted to access certain page, based on their `role`. If their role doesn't match the correct

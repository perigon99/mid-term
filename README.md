# Lux Pick-Up Restaurant Project

Lux Restaurant is a single-page full stack web application built with Node/Express/Ajax/jQuery/pSQL that allows customers
to order food for pick-up from a restaurant.

## Final Product

Main Page:

![image](https://user-images.githubusercontent.com/75704947/107803573-c1ab0300-6d30-11eb-85b1-5f3cd066fe03.png)

On Admin Login: Show customer orders sent to the kitchen (back-end):

![image](https://user-images.githubusercontent.com/75704947/107803496-a93ae880-6d30-11eb-8e05-4b18e78556c6.png)

Creating new menu items: 

![image](https://user-images.githubusercontent.com/75704947/107803629-db4c4a80-6d30-11eb-90a6-752d7134ddbc.png)

UI to control which menu items to exist (add/remove):

![image](https://user-images.githubusercontent.com/75704947/107803739-020a8100-6d31-11eb-9ea6-114f5ec73399.png)

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Body Parser 1.19.0 or above
- Chalk 2.4.2 or above
- cookie-session 1.4.0 or above
- dotenv 2.0.0 or above
- ejs 2.6.2 or above
- expess 4.17.1 or above
- morgan 1.9.1 or above
- node-sass-middleware 0.11.0 or above
- twillio 3.55.1 or above 


## Getting Started

- Install all dependencies (using the `npm install` command).
- Reset database: `npm run db:reset` to reset customer orders & menu items to default stored values.
- Run the development web server using the `npm run local` command. 
- Visit http://localhost:8080/
- To test customer/admin login pages, login data is provided in `02_fake_data.sql`

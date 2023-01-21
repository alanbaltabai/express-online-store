## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Overview](#overview)

## General info

The online-store created with MVC architecture, user/admin roles, authentication and authorization, online payment system, and REST API.

## Technologies

- Express.js (<i>Node.js framework</i>) version: 4.17.3
- Mongoose (<i>intermediate library between Express.js and MongoDB</i>) version: 6.2.10
- Multer (<i>middleware for handling files in form</i>) version: 1.4.4
- Passport.js (<i>authentication middleware</i>) version: 0.5.2
- Stripe (<i>API for online payment processing</i>) version: 8.220.0

## Setup

To run this project, install it locally using npm:

```
$ npm install
$ node app
```

## Overview

To authorize as admin, append `/logadmin` to the url. The username and password is — "admin". <br>
After authorizing, to go to admin page, append `/madmin` to the url.

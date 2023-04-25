# Online store
<img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" title="HTML5" alt="HTML" width="40" height="40"/>&nbsp;
<img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-original.svg"  title="CSS3" alt="CSS" width="40" height="40"/>&nbsp;
<img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="40" height="40"/>&nbsp;
<img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg" title="Node.js" alt="Node.js" width="40" height="40"/>&nbsp;
<img src="https://github.com/devicons/devicon/blob/master/icons/express/express-original.svg" title="Express" alt="Express" width="40" height="40"/>&nbsp;
<img src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original.svg" title="MongoDB" alt="MongoDB" width="40" height="40"/>&nbsp;


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

To run this project (after downloading and installing the packages):

```
$ npm start
```

## Overview

To authorize as admin, append `/logadmin` to the url. The username and password is — "admin" (I am aware I shouldn't store raw passwords like this). <br>
After authorizing, to go to admin page, append `/madmin` to the url.

# Squadhelp exam project

All progress located at branch dev

## Usage
If use  Docker Desktop 
```console
docker compose -f docker-compose-dev.yaml up
```

If don`t
```console
docker-compose -f docker-compose-dev.yaml up
```
## HowItWorks
The link is located in nav.
http://localhost:5000/howItWorks

## ButtonGroup
Located at the bottom of the Start Contest page.
http://localhost:5000/startContest

## EventList
Located at Header userInfo list.
http://localhost:5000/events

## Moderator
The role of the moderator is to allow or cancel incoming offers before the customer sees them.
http://localhost:5000/offersApprove
After confirming the user's offer, an email is sent to him and the customer is notified of the addition of a new offer. The link to the email is displayed in the console.
Admin can create moderators.

## Accounts
CUSTOMER
          firstName: 'buyerfn',
          lastName: 'buyerln',
          password: 123456,
          email: 'buyer@gmail.com',
          
CREATOR
          firstName: 'creativefn',
          lastName: 'creativeln',
          password: 123456,
          email: 'creative@gmail.com',

MODERATOR
          firstName: 'moderatorfn',
          lastName: 'moderatorln',
          password: 123456,
          email: 'moderator@gmail.com',
          
ADMIN
          firstName: 'admin',
          lastName: 'admin',
          password: 123456,
          email: 'admin@gmail.com',


## Exercises by branches

1-3 addRefactorAndBugFix, addSmallFix

4 addHowItWorksPage, addHowItWorksPageContent

5 addEvents

6 addButtonGroup

7 https://github.com/Tarold/db-exercises-exam

mongoexercise.mongodb.js

8-11 https://github.com/Tarold/db-exercises-exam/

sql-exercises.sql, db_visualize.svg

12-13 addErrorLogger

14 addModerator

15 addPostgreChat

# Beehive, A social media website built using a MERN Stack.

**Application URL: <http://34.16.177.144/> **

| Name |  Email | GitHub Username | Role |

| Matthew Hernandez | mhernandez30@mail.sfsu.edu | MegaMatt705 | Github Master - Back End Lead |

| Pearl Anyanwu | peaanyanwu@gmail.com | pearlanyanwu | Scrum Master |

| Satvik Verma | sverma@sfsu.edu | Satvik-Verma | Team Lead |

| Aaron Pham | apham13@sfsu.edu | PhatNarwhals | Front-End Help |

| Ben Dinh | bendinh51@gmail.com | bDinh2 | Front-End Lead |

| Sungmu Cho | smc6189@gmail.com | smc7002 | Back-End Help |


CONFIGURE SOFTWARE STACK

1. With provided shared Google Compute Engine Project Invitation

   Visit -> https://console.cloud.google.com/welcome/new?hl=en&authuser=1&project=academic-ocean-398623

   Click 3 bars at top right and navigate to Compute Engine

   From Compute Engine, navigate up to VM Instances

   In column Connect, click on SSH

   New window should pop up "transferring SSH keys to the VM"

   Pop up asking to authorize, click Authorize

   Connected to VM Terminal

2. VM is hosted on Ubuntu

   cd /var/www/html

3. Setup mySQL by:

   sudo apt install mysql-server

   sudo service mysql status

   if mysql is not running correctly -> sudo service mysql restart

   In VM -> "sudo mysql -u root -p" (without "")

   enter the password: "Satvik" (case-sensitive)

   If you put the correct password, you will be able to open MySQL monitor.

   To see databases, type "show databases;"

   To read the table information, type "use [database_name]"

   Our database is in webApp, type "use webApp"
   
   To show the tables in database, type "show tables;"

   To verify the tables in database, type "describe [table_name];"

   ex -> describe teamMembers;

   To see table information, type "select * from [table_name];"
   
   To see table 'teamMembers', type "select * from teamMembers;"

4. Setup Apache 2 by:

   Connecting through SSH

   Update package list: sudo apt -get update

   Install http server: sudo apt-get install apache2 php7.0

   Overwrite default web page with: "echo " placeholder in html | sudo tee /var/www/html/index.html

5. Setup NodeJS - React/ExpressJS by:

   apt install nodejs

   sudo apt install npm

   sudo npm i express

   Verify by: node -v | npm -v | npm list express

6. Download VSC

   https://code.visualstudio.com/Download

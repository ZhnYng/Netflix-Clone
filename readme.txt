********BED CA2 Assignment Set UP********
###### Lim Zhen Yang DAAA/FT/1B/04 ######

1. There are two folders, client and server
2. For each folder, 
    1. Run "npm i" to install all npm dependencies
    2. Run "npm start" in the current directory to start the server/client

3. Open MySQL Workbench
4. Press Ctrl + Shift + O
5. Double-click on sakila_bed.sql
6. Click on the lightning bolt on the top left of the workspace to run the script

***** There have been some changes made to the database *****

1. email column in staff table is set to UNIQUE
2. password column added to customer table
3. name column renamed to category in category table
4. New table called rating
5. New table called basket

***** These changes should have been made in the sakila_bed.sql code *****
***** Running the sql script should work *****
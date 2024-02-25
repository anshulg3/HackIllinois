import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('aquarium.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE "subleases" ( "id" INTEGER UNIQUE, "name" VARCHAR(256), 
               "price" INTEGER, "description" TEXT, "date" DATE, "googleid" VARCHAR(256), 
               "sellername" VARCHAR(256), "selleremail" VARCHAR(256), "imageurl" TEXT, 
               "category" VARCHAR(256), PRIMARY KEY("id" AUTOINCREMENT) )''')

conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()
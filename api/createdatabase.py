import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('aquarium.db')
cursor = conn.cursor()

# Define the table name
table_name = 'subleases'

# Fetch all rows from the specified table
cursor.execute(f'SELECT * FROM {table_name}')
rows = cursor.fetchall()

# Print the rows
for row in rows:
    print(row)

# Close the connection
conn.close()
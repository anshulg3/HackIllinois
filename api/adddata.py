import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('aquarium.db')
cursor = conn.cursor()

# Define some bogus data to insert
bogus_data = [
    ('Apartment 1', 1000, 'Spacious apartment with a great view', '2024-02-23'),
    ('Apartment 2', 1500, 'Cozy studio in the heart of the city', '2024-02-24'),
    ('House 1', 2000, 'Beautiful house with a garden', '2024-02-25')
]

# Insert the bogus data into the subleases table
cursor.executemany('''
    INSERT INTO subleases (name, price, description, date)
    VALUES (?, ?, ?, ?)
''', bogus_data)

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Bogus data inserted successfully.")
from datetime import datetime
from flask import Flask, request, jsonify, session, abort, redirect
from flask_cors import CORS
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from pip._vendor import cachecontrol
import google.auth.transport.requests
import os, pathlib, json, sqlite3, requests
from fuzzywuzzy import process
app = Flask(__name__)
CORS(app)

def getMoreSimilar():
    try:
        conn = sqlite3.connect('aquarium.db')
        cursor = conn.cursor()
        category = request.args.get('category')
        if category: 
            query = 'SELECT id, name, price, description, date, sellername, selleremail, imageurl, category FROM subleases WHERE category = ?;'
            cursor.execute(query, (category,))
        else:
            cursor.execute("SELECT id, name, price, description, date, sellername, selleremail, imageurl, category FROM subleases")
        data = cursor.fetchall()
        inputData = request.args.get('query')
        if inputData is None:
            attributes = ['id', 'name', 'price', 'description', 'date', 'sellername', 'selleremail', 'imageurl', 'category']
            data = [dict(zip(attributes, row)) for row in matched_rows]
            return jsonify(data)
        
        matches = process.extract(inputData, [str(d[0]) + " " + d[1] + " " +d[3] for d in data], limit=50)
        if matches:
            matched_rows = []
            for match in matches:
                combined_desc = match[0]  # Extract description from the match tuple
                # Find the rows with the matching id
                id = combined_desc.split(" ")[0]
                matched_rows.extend([row for row in data if str(row[0]) == str(id)])
            
            attributes = ['id', 'name', 'price', 'description', 'date', 'sellername', 'selleremail', 'imageurl', 'category']
            data = [dict(zip(attributes, row)) for row in matched_rows]
            return jsonify(data)
        else:
            return jsonify({'message': 'No matches found'})

    except Exception as e:
        return jsonify({'error': str(e)})



# Open the JSON file
with open('client_secret.json', 'r') as f:
    data = json.load(f)

app.secret_key = data['web']['client_secret'] # STORE THIS SECURELY IN AN ENVIRONMENT VARIABLE!!!

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev

GOOGLE_CLIENT_ID = data['web']['client_id'] # STORE THIS SECURELY IN AN ENVIRONMENT VARIABLE!!!
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:8080/callback"
)

def login_is_required(function):
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)  # Authorization required
        else:
            return function()

    return wrapper

@app.route('/api/login')
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return authorization_url

@app.route('/api/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out!'}), 200


@app.route('/callback', methods=['GET'])
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        abort(500)  # State does not match!

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")
    
    #return jsonify(message=f"Hello {session['name']}!", status=200)
    return redirect("http://localhost:3000/")

@app.route("/api/protected_area")
@login_is_required
def protected_area():
    return jsonify(message=f"Hello {session['name']}!", status=200)

# def create_feature_vector():
    


def get_data():
    # Connect to the SQLite database
    sqliteConnection = sqlite3.connect('aquarium.db')
    cursor = sqliteConnection.cursor()
    
    # Write a query to retrieve the data
    getmydata = request.args.get('getmydata')
    id = request.args.get('id')
    limit = request.args.get('limit')
    category = request.args.get('category')
    if id: # not necessary
        query = 'SELECT id, name, price, description, date, sellername, selleremail, imageurl, category FROM subleases WHERE id = ?;'
        cursor.execute(query, (id,))
    elif getmydata:
        if "google_id" not in session:
            return abort(401)
        googleid = session["google_id"]
        query = 'SELECT id, name, price, description, date, sellername, selleremail, imageurl, category FROM subleases WHERE googleid = ?;'
        cursor.execute(query, (googleid,))
    elif limit:
        query = 'SELECT id, name, price, description, date, sellername, selleremail, imageurl, category FROM subleases ORDER BY date DESC LIMIT ?;'
        cursor.execute(query, (limit,))
    else:
        query = 'SELECT id, name, price, description, date, sellername, selleremail, imageurl, category FROM subleases;'
        cursor.execute(query)

    rows = cursor.fetchall()

    # Define the attribute names
    attributes = ['id', 'name', 'price', 'description', 'date', 'sellername', 'selleremail', 'imageurl', 'category']

    # Convert each row into a dictionary with named attributes
    data = [dict(zip(attributes, row)) for row in rows]

    # Close the cursor and the database connection
    cursor.close()
    sqliteConnection.close()

    # Return the retrieved data as JSON
    return jsonify(data)

def post_data():
    try:
        # Get JSON data from the request
        json_data = request.get_json()

        # Extract data from the JSON object
        name = json_data.get('name')
        price = json_data.get('price')
        description = json_data.get('description')
        category = json_data.get('category')
        imageurl = json_data.get('imageurl')
        current_date_time = datetime.now()
        date = current_date_time.date()
        if "google_id" not in session:
            return abort(401)
        #print(session)
        googleid = session["google_id"]
        sellername = session["name"]
        selleremail = session["email"]

        # Connect to the SQLite database
        sqliteConnection = sqlite3.connect('aquarium.db')
        cursor = sqliteConnection.cursor()

        # Write a query to insert the data into the database
        if imageurl:
            query = "INSERT INTO subleases (name, price, description, date, googleid, sellername, selleremail, imageurl, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
            cursor.execute(query, (name, price, description, date, googleid, sellername, selleremail, imageurl, category))
        else:
            query = "INSERT INTO subleases (name, price, description, date, googleid, sellername, selleremail, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
            cursor.execute(query, (name, price, description, date, googleid, sellername, selleremail, category))
        sqliteConnection.commit()

        # Close the cursor and the database connection
        cursor.close()
        sqliteConnection.close()

        # Return a success message
        return jsonify({'message': 'Data posted successfully'}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    
# def put_data():
#     try:
#         # Get JSON data from the request
#         json_data = request.get_json()

#         # Extract data from the JSON object
#         id = json_data.get('id')
#         name = json_data.get('name')
#         price = json_data.get('price')
#         description = json_data.get('description')
#         current_date_time = datetime.now()
#         date = current_date_time.date()
#         if "google_id" not in session:
#             return abort(401)
#         googleid = session["google_id"]

#         # Connect to the SQLite database
#         sqliteConnection = sqlite3.connect('aquarium.db')
#         cursor = sqliteConnection.cursor()

#         # Write a query to update the sublease by its id and googleid
#         query = "UPDATE subleases SET"
#         params = []

#         if name:
#             query += " name = ?,"
#             params.append(name)
#         if price:
#             query += " price = ?,"
#             params.append(price)
#         if description:
#             query += " description = ?,"
#             params.append(description)
#         query += " date = ?,"
#         params.append(date)

#         # Remove the trailing comma
#         query = query.rstrip(',')

#         # Add the WHERE clause to specify the sublease id and googleid
#         query += " WHERE id = ? AND googleid = ?;"
#         params.extend([id, googleid])

#         # Execute the query with the provided parameters
#         cursor.execute(query, params)
#         sqliteConnection.commit()

#         # Close the cursor and the database connection
#         cursor.close()
#         sqliteConnection.close()

#         # Return a success message
#         return jsonify({'message': 'Data updated successfully'}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

def delete_data():
    try:
        # Get JSON data from the request
        json_data = request.get_json()
        print(json_data)
        # Extract data from the JSON object
        ids = json_data.get('ids')
        if "google_id" not in session:
            return abort(401)
        googleid = session["google_id"]

        # Connect to the SQLite database
        sqliteConnection = sqlite3.connect('aquarium.db')
        cursor = sqliteConnection.cursor()

        # Write a query to delete the subleases by their ids and googleid
        query = "DELETE FROM subleases WHERE id = ? AND googleid = ?;"

        # Prepare the parameters
        params = [(id, googleid) for id in ids]

        # Execute the query with the provided parameters
        cursor.executemany(query, params)
        sqliteConnection.commit()

        # Close the cursor and the database connection
        cursor.close()
        sqliteConnection.close()

        # Return a success message
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred: ' + str(e)}), 500




# def get_similarities():
#     # Grab all the descriptions
#     conn = sqlite3.connect('aquarium.db')
#     cursor = conn.cursor()
#     sql_query = "SELECT description FROM subleases"
#     cursor.execute(sql_query)
#     rows = cursor.fetchall()
#     descriptions = [row[0] for row in rows]
#     print(descriptions)

#     # Tokenize them and run word2vec_model
#     tokenized_descriptions = [word_tokenize(desc.lower()) for desc in descriptions]
#     word2vec_model = Word2Vec(sentences=tokenized_descriptions, vector_size=100, window=5, min_count=1, workers=4)

#     # Convert actual text to features
#     def text_to_feature_vector(text):
#         tokens = word_tokenize(text.lower())
#         word_vectors = []
#         for token in tokens:
#             if token in word2vec_model.wv:
#                 word_vectors.append(word2vec_model.wv[token])
#         if word_vectors:
#             return np.mean(word_vectors, axis=0)
#         else:
#             return np.zeros(word2vec_model.vector_size)
    
#     # Create the vectors based on all the descriptions
#     apartment_vectors = {desc: text_to_feature_vector(desc) for desc in descriptions}

#     def calculate_similarity(apartment1, apartment2):
#         return cosine_similarity([apartment1], [apartment2])[0][0]

# # Function to recommend similar apartments based on a given apartment
#     def recommend_similar_apartments(target_apartment, top_n=3):
#         similarities = {}
#         target_vector = apartment_vectors[target_apartment]
#         for apt_desc, apt_vector in apartment_vectors.items():
#             if apt_desc != target_apartment:
#                 similarity_score = calculate_similarity(target_vector, apt_vector)
#                 similarities[apt_desc] = similarity_score
#         # Sort apartments by similarity score
#         sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
#         # Return top N similar apartments
#         # return sorted_similarities[:top_n]
#         return [apt_desc for apt_desc, _ in sorted_similarities[:top_n]]

#     getmydata = request.args.get('description')
#     print(getmydata)
#     recommended_apartments = recommend_similar_apartments(getmydata)
#     return jsonify(recommended_apartments)

    
    


# Add the routes to the Flask app
app.add_url_rule('/api/data', methods=['GET'], view_func=get_data)
app.add_url_rule('/api/data', methods=['POST'], view_func=post_data)
app.add_url_rule('/api/data', methods=['DELETE'], view_func=delete_data)
#app.add_url_rule('/api/data', methods=['PUT'], view_func=put_data)
app.add_url_rule('/api/similarity', methods=['GET'], view_func=getMoreSimilar)

if __name__ == '__main__':
    # get_similarities(14)
    app.run(port=8080, debug=True)
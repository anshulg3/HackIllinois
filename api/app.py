from flask import Flask, request, jsonify, session, abort, redirect, request
import os, pathlib, json, sqlite3
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
app = Flask(__name__)

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

@app.route('/api/login', methods=['POST'])
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route('/api/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect("/")

@app.route('/api/callback', methods=['GET'])
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
    return redirect("/") #change this

def get_data():
    # Connect to the SQLite database
    sqliteConnection = sqlite3.connect('aquarium.db')
    cursor = sqliteConnection.cursor()

    # Write a query to retrieve the data
    query = 'SELECT id, name, price, description, date FROM subleases;'
    cursor.execute(query)
    rows = cursor.fetchall()

    # Define the attribute names
    attributes = ['id', 'name', 'price', 'description', 'date']

    # Convert each row into a dictionary with named attributes
    data = [dict(zip(attributes, row)) for row in rows]

    # Close the cursor and the database connection
    cursor.close()
    sqliteConnection.close()

    # Return the retrieved data as JSON
    return jsonify(data)

def post_data():
    # Connect to the SQLite database
    sqliteConnection = sqlite3.connect('aquarium.db')
    cursor = sqliteConnection.cursor()

    # Extract data from the request
    name = request.form.get('name')
    price = request.form.get('price')
    description = request.form.get('description')
    date = request.form.get('date')

    # Write a query to insert the data into the database
    query = "INSERT INTO subleases (name, price, description, date) VALUES (?, ?, ?, ?);"
    cursor.execute(query, (name, price, description, date))
    sqliteConnection.commit()

    # Close the cursor and the database connection
    cursor.close()
    sqliteConnection.close()

    # Return a success message
    return 'Data posted successfully'

# Add the routes to the Flask app
app.add_url_rule('/api/data', methods=['GET'], view_func=get_data)
app.add_url_rule('/api/data', methods=['POST'], view_func=post_data)

if __name__ == '__main__':
    sqliteConnection = sqlite3.connect('aquarium.db')
    cursor = sqliteConnection.cursor()
    print('DB Init')
 
    # Write a query and execute it with cursor
    query = 'select sqlite_version();'
    cursor.execute(query)
    result = cursor.fetchall()
    print('SQLite Version is {}'.format(result))
 
    # Close the cursor
    cursor.close()
 
    app.run(port=8080)
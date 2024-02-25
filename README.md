<img src="./web_app/src/media/IlliniMarketLogo.jpg" alt="Logo" width="400" height="400">

## HackIllinois 2024 Project

Welcome to Illini Market! This is a web application that allows students to buy and sell items with other students on campus. This project was created for HackIllinois 2024.

## Authors

Anshul Goswami, Ryan Lee, Ansh Verma, Nehan Tarefder

## Project Overview

### Inspiration

Having met each other for the first time just a few short days ago, we began getting to know each other through our shared heritage as students at the University of Illinois. The conversation steered toward something we’ve all experienced, something that’s almost a joke at this point, the UIUC Snapchat Story. We talked about how so many students post things that they’re buying and selling on that story for others to see, yet none of us have ever had the time or energy to sit down and tap through it. We know for a fact that many, if not all, students have the same view on it. Similar experiences exist across various other platforms, such as the r/UIUC subreddit, on which hundreds of students search for a sublease on their apartments every semester. However, what if there was a way to make shopping from your fellow Illinis a million times easier? That’s where Illini Market comes in.

### What it does

"Illini Market" is a dynamic web application designed to streamline the process of discovering various listings posted by other students that are essential for university life. These could range from subleases, to school supplies, to tickets for events, all within an intuitive and interactive interface. Emphasizing user convenience, the platform offers seamless integration with Google authentication, ensuring secure sign-in procedures for all users. Once the user is logged in, they can view listings created by other users for virtually any product, including things such as clothes or electronics. The website incorporates a powerful search algorithm to find products of relevance to any search our users could devise. Logged in users also have the ability to create their own listings and publish them to the website for anyone to view. If a user finds a listing of interest, they can click on the listing to get more information and easily contact the listing owner via email with the click of a button. By streamlining the process through which students can share and exchange products, Illini Market represents the last puzzle piece in the Illini community.

### How we built it

We opted for the React framework for its versatility and efficiency, complemented by the visually stunning Chakra UI to ensure an appealing user interface. Having various pre-styled components simplified the process of creating the UI, allowing us to focus more heavily on the inner workings of Illini Market.
For the backbone of our application, we integrated a Flask-based backend paired with a simple yet robust SQLite database. As Flask is a standalone microframework written with Python, it allowed for rapid prototyping and iteration on our API as our development needs evolved throughout the hackathon. The Flask backend became the orchestrator, handling requests from the web-app and seamlessly connecting with the SQLite database to retrieve and store information. Users would be seamlessly and securely logged in to our application through our application’s use of the OAuth 2.0 protocol and interaction with Google’s secure and comprehensive OAuth 2.0 API endpoints through access tokens, which essentially outsource our authentication security to Google. This allows us to read user data that the user consents to giving such as their name and email directly from their Google account, while keeping the user’s credentials private, thereby allowing the end users to trust our application as they don’t need to provide their password to us.
A standout feature of our web app was the powerful and intuitive search functionality. We recognized the need for users to easily find relevant listings, and to achieve this, we implemented a cutting-edge search algorithm. Leveraging an implementation of the [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm, we devised a pipeline that intelligently calculated the semantic similarity between user queries and listings, allowing us to surface only the most relevant results.

### Challenges we ran into / Accomplishments that we're proud of / What we learned

One of the earliest challenges we faced in the development of our project was the integration with Google’s authentication link, particularly with CORS issues since we were running our server locally. We overcame this by using specific redirects and requests between our client, server, and Google’s authentication server, which enabled us to get around the tricky CORS rules. We also faced challenges when attempting to implement the algorithm for our search, particularly in manipulating the table data in order to get it in the right format for the similarity processing function input, and then using the output of the function to get back the table items that were most similar to our query.

One thing we are collectively proud of is that each of us picked up a new language or framework during the hackathon and were able to use it to successfully implement key features in our project. For example, we were able to learn and implement fuzzy string matching for our search feature, as well as pick up Chakra UI on the fly to easily create intuitive user interfaces. In addition, we are proud that we were able to work efficiently as a team, use Git effectively, and help each other across all parts of the application as we built it.

Lastly, a breakthrough moment was when we managed to use our Levenshtein distance algorithm to enable robust semantic search. As we iterated upon several algorithms to achieve this goal, they continued to fall short of our expectations. After exhausting several options, we stumbled across this algorithm and it serviced our exact need. Once we had the basic search functionality work, we went the extra mile to integrate it directly into the posts, where a user could easily find related listings in just one click. In the end, this feature allowed for an intelligent touch to how users interact with our platform.

### What's next for Illini Market

We plan to change our database to MySQL integrated with a cloud platform such as Microsoft Azure to make our application more scalable. SQLite was portable and easy to test our code with, but is very limited in scalability. We genuinely believe our project can inform and positively impact hundreds of students looking for more affordable subleases, academic materials, and other tools needed to have a good experience on campus. Thus, making our product more scalable is our top priority.
In addition, we plan to implement a feature to facilitate payments between users on the website, in case clients want to buy someone’s listing on the spot. We also envision an image vector search feature, for clients who can envision a particular apartment or piece of equipment they are searching for but are unable to describe it in words. These features will make our app inclusive of students and their situations, ultimately allowing for a more productive and joyful experience using our product.

## Getting Started

### Requirements

- Python
- Node

Note: It's recommended to first create a virtual environment with Python to isolate dependencies.

Steps:

1. Clone the repository into the working directory:

   `git clone https://github.com/anshulg3/Illini-Market.git`

   `cd Illini-Market`

2. Install the dependencies (node_modules) for the React frontend:

   `cd web_app`

   `npm install`

3. Navigate to the `api` directory, install the backend dependencies, and create the database:

   `cd ..`

   `cd api`

   `pip install -r requirements.txt`

   `python createdatabase.py`

4. Run `python app.py` to start the Flask server

Once you have the project set up, you can run the following commands to start the web application:

`cd ../web_app`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# SoundMates

The motivation behind the SoundMates project was to create a social mobile app that connects people who share similar music tastes. We wanted to leverage user location and music app APIs to make it easy for users to discover, connect, and engage with others around them who are listening to the same music.

# Key Features

Key Features:

Music Taste Matching:
The app analyzes users' music listening history from connected music apps (Apple Music, Spotify, YouTube Music) and matches them with other users who have similar music tastes.

Location-based Discovery:
SoundMates uses the user's location to find nearby users who share the same music preferences. Users can view profiles of people nearby and see what they're currently listening to.

Airdrop Song Sharing:
Users can easily airdrop a song they want to share with others. They can choose to share the song with specific individuals or allow anyone nearby to listen.

Privacy Modes:
SoundMates has two privacy modes for users. When the "Talk to Me" mode is on, other users can initiate conversations. If users turn off this mode, they won't receive any messages from others.

In-app Messaging:
Users can chat with their music matches, discuss songs and artists, and share playlists or recommendations.

Integration with Music Apps:
SoundMates seamlessly integrates with popular music apps (Apple Music, Spotify, YouTube Music) through APIs, allowing users to play songs directly within the app.

Personalized Music Recommendations:
Based on the user's music taste and listening history, SoundMates provides personalized recommendations for songs, artists, and playlists.

# Techniques Required

Frontend (Mobile App):

React Native: This popular cross-platform framework allows you to build native mobile apps for both iOS and Android using JavaScript and React. With a large community and extensive library support, React Native provides a cost-effective and efficient way to develop your app with a single codebase.

Backend:

Node.js: A lightweight, scalable, and efficient JavaScript runtime built on Chrome's V8 engine, Node.js is ideal for creating the backend server for your app. It's easy to integrate with other JavaScript-based tools, and there are numerous libraries available for handling various tasks.
Express.js: This is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Use Express.js to handle API endpoints, routing, and middleware.
Database:

MongoDB: A popular NoSQL database that works well with JavaScript-based applications. MongoDB is scalable, flexible, and offers high performance, making it a good choice for storing user data and managing connections.
Location Services:

Google Maps Platform: Provides APIs and SDKs to implement location-based features, such as geolocation, geocoding, and nearby search. You can use the Google Maps Platform to find and match users based on their proximity and music preferences.
In-App Messaging:

Firebase Realtime Database or Firestore: Both are part of the Firebase platform by Google, and they provide real-time data synchronization and storage for in-app messaging systems. Firebase also offers other useful services, such as user authentication and cloud storage.
API Integration:

Axios: A popular JavaScript library for making HTTP requests. Use Axios to interact with the APIs of Apple Music, Spotify, and YouTube Music.
By using these frameworks and tools, you can efficiently develop a high-quality, scalable, and feature-rich app like SoundMates for both iOS and Android platforms.

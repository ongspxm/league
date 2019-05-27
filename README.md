# League Tracking

**url for application:** [github.io](https://ongspxm.github.io/league/)

In a round robin tournament, the league table can be generated using by recording the scores of each game, and then sorted according to the number of goals score and the points scored.

## features
This weekend project has a few functions. Here is a list of features that is implemented in this current version of the project. 

### offline application
To ensure that the application can be used without network. The application is designed to be offline using service workers. The service worker basically caches the files and serve it when the `fetch` event is fired.  

### fixture generation
The key restriction to the fixture generation is that the same team do not get to play two consecutive games. This is done by generating all the possible games between the teams, and then using DP to generate one that doesn't have any clashes (same team playing 2 consecutive games).

As long as there less than 5 players, there will be impossible to find an arrangement that fits this restriction, otherwise, we will set the fixture with the no 2 consecutive games restriction.

### state sharing
Since the application is available offline, it makes sense to have the data and information stored on the client browser itself. However, in order to share the table's information, it would be necessary to somehow be able to transfer the state from one browser to the other.

This is done through `location.hash`. This hash is updated with the new information. And when this hash is loaded into the template, the information will be extracted and displayed. All these are implemented by encoding the relevant information in base64 form, then appending it to the hash.

## source
The source for this particular project is available [here](https://github.com/ongspxm/league/).

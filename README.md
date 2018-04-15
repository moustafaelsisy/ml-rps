# ML Rock-Paper-Scissors

A web-based demo of using some basic AI algorithms pitched against Neural Networks and other simple Machine Learning algorithms.

## Direction

This demo is currently in its early stages. Initially, I preferred to try out `Tensorflow.js` for a completely client-based demo, however I think that the library is still not fully mature yet (its still a very exciting project nonetheless!). So I moved to using keras on a very lightweight Flask web server, and using API calls for the Neural Networks. This approach is unfortunately quite slow, and so to be able to collect any valuable results, it has to execute much faster. Thus, I am planning on moving the full project to python, with none of the client-server code.

## Acknowledgements

Thanks a lot to Dr. Dave Churchill for the awesome `rps.html` and `rps.js` skeleton code that first gave rise to this experiment!
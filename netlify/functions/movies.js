// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // Conditional that gives error message if year or genre are not provided
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please enter a year and genre in the URL` // a string of data
    }
  }
  else {
    // If year and genre are provided, first build an empty array to be populated
    let returnValue = {
      numResults: 0,
      movies: []
    }
    // Build a for loop that goes through all the movies
    
    for (let i=0; i < moviesFromCsv.length; i++) {
      //Build a conditional statement that will add the movie to the ReturnValue array if a match
      //Store current listing in memory
      let currentMovie = moviesFromCsv[i]
    
      //Check if memory matches year and genre
      // To do: Ignore if no runtime (genre will already be ignored)
      
      if (currentMovie.genres.includes(genre) && currentMovie.startYear==year && currentMovie.runtimeMinutes !== "\\N" && currentMovie.genres.includes("\\N")==false) {
        // If matches, create post object and populate post object with relevant fields

        postObject = {
          title: currentMovie.primaryTitle,
          year: currentMovie.startYear,
          genres: currentMovie.genres,
          //runtime: currentMovie.runtimeMinutes //Originally includes to check if any have "//N" in runtime
        }
        // Push post object to return array
        returnValue.movies.push(postObject)
        // Keep count of how many results are returned
        //returnValue.numResults++
      }
      // Determine the number of results based on length of the array. Other method (counting each time one is added) is commented out above
      returnValue.numResults = returnValue.movies.length
    }

    // Return the returnValue array
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     // Use json stringify to return the returnValue array as a string
      body: JSON.stringify(returnValue)
      
    }
  }
}
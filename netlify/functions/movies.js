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
  // Pull in the inputs from the user in the URL
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
      //Store current listing in memory
      let currentMovie = moviesFromCsv[i]
    
      // Use conditional to check if memory matches year and genre and make sure the movie has a genre and a runtime
      // Note: The genre check is likely unnecessary given genre is one of the querystring parameters but it is included for redundancy
      
      if (currentMovie.genres.includes(genre) && currentMovie.startYear==year && currentMovie.runtimeMinutes !== "\\N" && currentMovie.genres.includes("\\N")==false) {
        // If matches, create movie object and populate post object with relevant fields
        movieObject = {
          title: currentMovie.primaryTitle,
          year: currentMovie.startYear,
          genres: currentMovie.genres,
          //runtime: currentMovie.runtimeMinutes //Originally includes to check if any have "//N" in runtime
        }
        // Push post object to return array
        returnValue.movies.push(movieObject)

        // Keep count of how many results are returned
        //returnValue.numResults++
      }
      // Determine the number of results based on length of the array. Other method (counting each time one is added) is commented out above
      returnValue.numResults = returnValue.movies.length
    }
    
    // Return a seperate error message if the user enters a genre and year but it doesn't return any results, likely due to a spelling or syntax error
    if (returnValue.numResults == 0) {
      return {
        statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        body: `Please make sure you entered the year and genre correctly. The year should have 4 digits (ex: 2018) and the genre should be capitalized (ex: Comedy).` // a string of data
      }
    } else {
      // If there are results to show, display the returnValue object
        return {
          statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
         // Use json stringify to return the returnValue array as a string
          body: JSON.stringify(returnValue)
          
        }

      }
    }
  }

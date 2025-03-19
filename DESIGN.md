# SlicerAPI

# MVP

## API:
### POST /slice
Takes in a 3d model file and a profile ID
TODO: Another version of this that just returns sliced stats rather than the gcode. Either an option in the request body or a separate route IDK yet

### GET /profiles
Returns a list of all printer profiles

### GET /profiles/{profile_id}
Returns the printer profile .ini file of the given profile id

### POST /profiles
Upload a new printer profile .ini file and include a name/label for the profile

### DELETE /profiles/{profile_id}


## Storage
For the MVP we can just use the filesystem for storing the printer profiles and not need an actual database running.

For example, when a user calls `POST /profiles`, the .ini profile file will just be saved to a folder on the server.
When a user calls `GET /profiles` it will just return a list of all of the files in that folder.
When a user calls `GET /profiles/{profile_id}, it will read the file from the file system and return that file as the HTTP response.

TODO: We should also implement AWS S3 as a storage option so that someone could choose to deploy it with just regular file system storage or storing the profiles in S3



# Docker Deployment to Lambda
TODO:

Best choice might be to just use a non aws base image:
https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-types

and so ill need to add ric


# TODO: A cloud slicer frontend?
What would the frontend be able to do?
- slice
- rotate
- move
- switching units changes model size on build plate
- select either a printer or a profile
...
- select face to put against build plate?
- scale?
- auto orient? Nah


# Issues:
- Setup development environment
    - install PrusaSlicer or use Docker image
- Create a function to slice a 3d model with a test profile into a .gcode file
    - SLICER_EXECUTABLE_PATH
- Add a route to upload a new printer profile
- Add a route to download that printer profile again
- Add a route to GET all printer profiles
- Add a route to the slice function which responds with the gcode
- Modify the slice route to take in a profile_id and slice the 3d model with that printer profile
- Add a route to return just stats about the print rather than the whole gcode file
    - it gets parsed out of the gcode
- Add a route to delete a printer profile
- Add S3 to swap out with the fs functions so it can be ran easily in the cloud
- Add lambda handler to handle the routes
- Common printer profiles pre-setup?


I can save the gcode also to files actually and use that as /gcode routes or whatever.

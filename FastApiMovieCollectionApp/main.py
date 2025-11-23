# FastAPI server
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, HTMLResponse
from fastapi import Body

# creating application
app = FastAPI()

# dictionnary
movies = [
    { "id": 1, "title": "Inception", "director": "Christopher Nolan", "year": 2010 },
    { "id": 2, "title": "The Matrix", "director": "The Wachowskis", "year": 1999 },
    { "id": 3, "title": "Parasite", "director": "Bong Joon-ho", "year": 2019 }
]

def generate_next_id():
    if len(movies) == 0:
        return 1
    return max(movie["id"] for movie in movies) + 1

def validate_movie_data(movie: dict, is_patch: bool = False):
    errors = []

    if "year" in movie:
        year = movie["year"]
        if not isinstance(year, int) or year < 1888:
            errors.append("Invalid year: must be an integer greater than or equal to 1888.")
    elif not is_patch:
        # year is required for POST-request
        errors.append("Year is required.")

    if "title" in movie:
        if not isinstance(movie["title"], str) or not movie["title"].strip():
            errors.append("Title is required and must be a non-empty string.")
    elif not is_patch:
        errors.append("Title is required.")

    if "director" in movie:
        if not isinstance(movie["director"], str) or not movie["director"].strip():
            errors.append("Director is required and must be a non-empty string.")
    elif not is_patch:
        errors.append("Director is required.")

    return errors if errors else None

# @ - decorator
@app.get("/", response_class=HTMLResponse)
def read_root():
    html = "<b>Movie managment app Fast API version</b>"
    for movie in movies:
        html += (
            f"<li>Title: {movie['title']}, Director: {movie['director']}, Year: {movie['year']}"
        )
    html += "</ol>"
    return html

@app.get("/movies")
def get_movies():
    return movies # automatically return as JS object array

@app.get("/movies/{id}", responses={
        404: {"description": "Movie with this id not found"} # to get 404 in swagger documentation
    })
def get_movies(id: int):
    for movie in movies:
        if movie["id"] == id:
            return movie # automatically result server code 200 OK
    raise HTTPException(status_code=404, detail = "Movie with this id not found")

@app.post("/movies", status_code = 201, responses={
              400: {"description": "Invalid movie data provided"}
          })
def add_movie(movie:dict = Body(...)): #student dict as a parameter, automatically processed
    validation_errors = validate_movie_data(movie, is_patch=False)
    if validation_errors:
        raise HTTPException(status_code=400, detail={"errors": validation_errors})

    new_movie = {
        "id": generate_next_id(),
        "title": movie.get("title"),
        "director": movie.get("director"),
        "year": movie.get("year")
    }
    movies.append(new_movie)
    return new_movie


@app.patch("/movies/{id}", responses={
        404: {"description": "Movie with this id not found"}, # to get 404 in swagger documentation
        400: {"description": "Invalid movie data provided"}
    })
def update_movie(id: int, new_movie_data: dict):
    validation_errors = validate_movie_data(new_movie_data, is_patch=True)
    if validation_errors:
        raise HTTPException(status_code=400, detail={"errors": validation_errors})

    for i, movie in enumerate(movies):
        if movie["id"]== id:
            updated_movie = {**movie, **new_movie_data}
            movies[i] = updated_movie
            return updated_movie
    raise HTTPException (status_code =404, detail = "Invalid movie id")

@app.delete("/movies/{id}", responses={
        404: {"description": "Movie with this id not found"} # to get 404 in swagger documentation
    })
def delete_movies(id: int):
    for index, movie in enumerate(movies):
        if movie.get("id") == id:
            movies.pop(index)
            return Response(status_code=204)
    raise HTTPException(status_code=404, detail = "Movie with this id not found")


## Course data

The course data is formatted as follows:

```
[
    {
        "credits": <number of credits for the course>,
        "description": <course description>,
        "keywords": <1D list of string keywords>,
        "name": <course name>,
        "number": <unique course number>,
        "requisites": <2D list of course requisites>,
        "sections": [
            {
                "instructor": <instructor name>,
                "location": <section location>,
                "subsections": [
                    {
                        "location": <subsection location>,
                        "time": {
                            <weekday>: <time range>, ...
                        },
    					"number": <subsection number>
                    }
                ],
                "time": {
                <weekday>: <time range>, ...
                },
				"number": <section number>
            }, ...
        ],
        "subject": <course subject>
    }, ...
]
```

- The list of course requisites consists of 1D lists with AND operations between them. Each 1D list has OR operations between elements. For example: `[[A, B], [C, D, E], [F]]` means that the requisites are `(A OR B) AND (C OR D OR E) AND (F)`. The requisites will be represented as the course's alpha-numeric key used in the outermost object.
- Sections and subsections can have any number of times. Each time's key is a weekday in all lowercase ("monday", "tuesday", "wednesday", ...). Each time's value is a string with the following format: `"<12 hour time><am or pm> - <12 hour time><am or pm>"`. An example of this would be `"11:45am - 12:35pm"`.
- Each course has exactly one subject



# Recommender

## 1

- Fetch data and Create a new component to display a previously taken course. This component might look somewhat like the Course component, but it will be simpler and won’t have options to add the course to the cart.
- Create a new component to hold the previously taken course components. Make this component accessible as a new tab in the app.
  
## 2

- Create a component for rating a specific course.
- Allow the user to rate courses they have already completed. (You can create the rating component as a child of the completed course component, for instance)

## 3

- Generate a list of interest areas based on the course data (maybe look at subjects and keywords)
- Create a component for the user to filter course results by interest area, using your list of interest areas. (A good place to put this wold be in the Sidebar Component)
- Make this component available to the user.

## 4

- Create a recommender algorithm that takes in the rated courses and interest areas. Use the interest areas of rated courses to recommend courses which have not yet been taken in the interest areas of highly rated completed courses.
- Create a new tab which displays the recommended courses to the user. (Maybe show a few recommended courses or sort all courses by their recommendation score)


## 5

- When adding a course to the cart, design a way to let the user know if they are not able to take the course based off of the requisites and the user's previously taken courses. Even if a student does not meet the requisites to enroll in a course, they should still be able to add it to the cart. 
  
## 6

- If the user is not able to take a course in the cart because the user does not meet the requisites, design a way to show the user the possible course paths to take to be able to take the desired course.

## 7

- Create a way for user to select courses they would like to take in the future from the courses they are currently unable to take in the cart (because of requisites). Factor these courses into the recommendation algorithm, giving a larger bias to the courses needed for the selected interest courses.



﻿# Fitness Tracker
 

## 1 

Provide the user with an option to sign out and return to the login screen at any point while they are logged in to the application.

 
## 2 

Provide the user with a "Today View" with the ability to view their exercises logged for today. The user should be able to see their exercises for today, including the name, duration, and the total number of calories burned for each exercise.The Today View should be updated in sync with the Exercises View; if a change is made to an exercise in the Exercises View, it should be reflected in the Today View. Similarly, if an exercise is added or created in the Exercise View, it should be added or deleted in the Today View. The user should also be able to see their meals for today, including the foods and the total number of calories and macronutrients for each meal. The extra credit problem must be completed first to be eligible for these points.

## 3

Provide the user with the ability to compare today's activity minutes versus their daily goal activity minutes. This can be made a part of the "Today View" from 2 or be made as a separate view.

    The user should be able to compare their total daily activity minutes (calculated as the sum of all exercise activity) versus their daily goal activity minutes.
    The view should be updated in sync with the Profile View; if a change is made to the user's goals, it should be reflected in their comparison.

The goals comparison should also show the difference in their overall calories and macronutrients. The extra credit problem must be completed first to be eligible for these points.


## 4 

Provide the user with the ability to create a new exercise or edit/delete any of their past exercises. An exercise consists of a name (e.g., "Jogging"), duration, date, and the number of calories burned; see the API for further details.

    The user should be able to see and specify the name, duration, and the number of calories burned for each exercise.
    The user should be able to indicate if the exercise was done at the current time or at some other time.

    Appropriately utilize icons or graphics to visually aid in the user experience; for example, you may want to have a graphic of a person exercising in the exercises view or a graphic of food in the meals view. 
    Use React Navigation in order to help the user navigate between views.

Provide the user with the ability to create a new meal, or edit/delete any of their past meals. A meal consists of a name (e.g., "Lunch"), a date, and a list of foods; see the API for further details.

    The user should be able to see and specify 0-to-many foods that they ate for that meal.
    The user should be able to see the total calories and macronutrients consumed for that meal.
    The user should be able to indicate if the meal was eaten at the current date and time or at some other date and time.

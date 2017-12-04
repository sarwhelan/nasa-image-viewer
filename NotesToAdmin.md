# Site Administration Instructions

## Editing the DMCA Notice
Navigate to `NASAImageViewer > client > src > app > dmca > dmca.component.html` and edit the current DMCA Notice text.


## Editing the Privacy Policy
Navigate to `NASAImageViewer > client > src > app > privacy-policy > privacy-policy.component.html` and edit the current Privacy Policy text.


## Dealing with DMCA/Infringement Notices and Takedown Requests
# Logging Any Kind of Complaint
Any notices will be received via email and you'll need to add them to the database where all complaints are kept.

You'll need Postman installed on your computer. Make a POST request to (http://localhost:8080/api/disputes) with the Body in `x-www-form-urlencoded` including the key, value pairs, where all values are plain String values, without " " around the words:
```
complaintBy
dateOfComplaint
complaintType
collectionID
accusedUser
```

# Viewing All Logged Complaints
Again, you need Postman. Make a GET request to (http://localhost:8080/api/disputes) and all complaints in the database will be returned in JSON format.

## Removing Collections and Notifying Infringing Users
To do this, you'll first need to determine which user owns the collection that a complaint has been made against.

Open Postman, send a GET request to (http://localhost:8080/api/findCollectionByName/CollectionName) where of course, the characters following the last / will be the name of the collection. Spaces ARE allowed, so if the collection name has spaces, use them as normal. A few results may be returned, and you'll need to determine which collection is the alleged infringing one based on the information provided.

Successfully identifying the collection means you now have the email address of the accused user. Simply send them an email outlining that their collection has been temporarily removed because of a DMCA notice. 

To remove their collection, you'll need to take note of its **_id**, seen in the last step. Using Postman, send a DELETE request to (http://localhost:8080/api/collections/idHere) and it'll be removed.

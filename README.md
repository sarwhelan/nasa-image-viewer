# NASA Image Viewer --- SE 3316A Web Technologies Final Project 2017

## Instructions on Getting NASA Image Viewer Onto Your Machine


## Assumptions/Notes Regarding Requirements
### 1. Authentication method
a) Login and Register options are shown on the Home-Page.

c) Used bcrypt hashing algorithm for storing passwords securely.


### 2. Limited functionality for unauthenticated users
c) The images shown when viewing a collection are already full size and resolution. However, this function is available in the Search area.


### 3. Additional functionality for authenticated users
a) The radio button for the "Create Collection" modal will not go to the "private" visibility checked state on default for some reason unknown to me. It's default does go to "private" in the "Edit Collection" modal, though. Even if neither "private" nor "public" is chosen in the "Create Collection" area, the visibility will be set to "private".


### 5. Site administrator functionality
a) and b) I am assuming that the administrator is myself or someone at the same skill level regarding HTML and MEAN stack knowledge. Therefore, myself or someone else will be capable of going into the HTML file and editing the DMCA and/or Privacy Policy section.

c) A document providing information on workflow and usage of tools is provided in the "NotesToAdmin.md" file.


Since all complaints/infringement notices/take-down requests are via email, the administrator will enter these into the database manually via Postman. Instructions are included in "NotesToAdmin.md" file.
